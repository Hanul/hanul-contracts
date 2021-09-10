import { expect } from "chai";
import { ecsign } from "ethereumjs-util";
import { constants } from "ethers";
import { waffle } from "hardhat";
import ERC20NFTMarketplaceArtifact from "../../artifacts/contracts/nft-marketplace/ERC20NFTMarketplace.sol/ERC20NFTMarketplace.json";
import AnimalNFTArtifact from "../../artifacts/contracts/test/AnimalNFT.sol/AnimalNFT.json";
import HanulCoinArtifact from "../../artifacts/contracts/test/HanulCoin.sol/HanulCoin.json";
import { AnimalNFT, ERC20NFTMarketplace, HanulCoin } from "../../typechain";
import { mine } from "../shared/utils/blockchain";
import { expandTo18Decimals } from "../shared/utils/number";
import { getERC20ApprovalDigest } from "../shared/utils/standard";

const { deployContract } = waffle;

describe("ERC20NFTMarketplace", () => {
    let coin: HanulCoin;
    let nft: AnimalNFT;
    let market: ERC20NFTMarketplace;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        coin = await deployContract(
            admin,
            HanulCoinArtifact,
            []
        ) as HanulCoin;
        nft = await deployContract(
            admin,
            AnimalNFTArtifact,
            []
        ) as AnimalNFT;
        market = await deployContract(
            admin,
            ERC20NFTMarketplaceArtifact,
            [coin.address]
        ) as ERC20NFTMarketplace;
    })

    context("new ERC20NFTMarketplace", async () => {
        it("sell and buy", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const price = expandTo18Decimals(10)
            await expect(market.sell(nft.address, 0, price))
                .to.emit(market, "Sell")
                .withArgs(nft.address, 0, admin.address, price)
            await coin.connect(other).mint(price);
            await coin.connect(other).approve(market.address, price);
            await expect(market.connect(other).buy(nft.address, 0))
                .to.emit(market, "Buy")
                .withArgs(nft.address, 0, other.address, price)
        })

        it("sell and buy with permit", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const price = expandTo18Decimals(10)
            await expect(market.sell(nft.address, 0, price))
                .to.emit(market, "Sell")
                .withArgs(nft.address, 0, admin.address, price)
            await coin.connect(other).mint(price);

            const nonce = await coin.nonces(other.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                coin,
                { owner: other.address, spender: market.address, value: price },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(other.privateKey.slice(2), "hex"))

            await expect(market.connect(other).buyWithPermit(nft.address, 0, deadline, v, r, s))
                .to.emit(market, "Buy")
                .withArgs(nft.address, 0, other.address, price)
        })

        it("sell and cancel", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const price = expandTo18Decimals(10)
            await expect(market.sell(nft.address, 0, price))
                .to.emit(market, "Sell")
                .withArgs(nft.address, 0, admin.address, price)
            await expect(market.cancelSale(nft.address, 0))
                .to.emit(market, "CancelSale")
                .withArgs(nft.address, 0, admin.address)
        })

        it("offer and accpet", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const price = expandTo18Decimals(10)
            await coin.connect(other).mint(price);
            await coin.connect(other).approve(market.address, price);
            await expect(market.connect(other).offer(nft.address, 0, price))
                .to.emit(market, "Offer")
                .withArgs(nft.address, 0, 0, other.address, price)
            await expect(market.acceptOffer(nft.address, 0, 0))
                .to.emit(market, "AcceptOffer")
                .withArgs(nft.address, 0, 0, admin.address)
        })

        it("offer with permit and accpet", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const price = expandTo18Decimals(10)
            await coin.connect(other).mint(price);

            const nonce = await coin.nonces(other.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                coin,
                { owner: other.address, spender: market.address, value: price },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(other.privateKey.slice(2), "hex"))

            await expect(market.connect(other).offerWithPermit(nft.address, 0, price, deadline, v, r, s))
                .to.emit(market, "Offer")
                .withArgs(nft.address, 0, 0, other.address, price)
            await expect(market.acceptOffer(nft.address, 0, 0))
                .to.emit(market, "AcceptOffer")
                .withArgs(nft.address, 0, 0, admin.address)
        })

        it("offer and cancel", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const price = expandTo18Decimals(10)
            await coin.connect(other).mint(price);
            await coin.connect(other).approve(market.address, price);
            await expect(market.connect(other).offer(nft.address, 0, price))
                .to.emit(market, "Offer")
                .withArgs(nft.address, 0, 0, other.address, price)
            await expect(market.connect(other).cancelOffer(nft.address, 0, 0))
                .to.emit(market, "CancelOffer")
                .withArgs(nft.address, 0, 0, other.address)
        })

        it("auction and bid and claim", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const startPrice = expandTo18Decimals(10)
            const bidPrice = expandTo18Decimals(11)
            const endBlock = (await provider.getBlockNumber()) + 100;
            await expect(market.auction(nft.address, 0, startPrice, endBlock))
                .to.emit(market, "Auction")
                .withArgs(nft.address, 0, admin.address, startPrice, endBlock)
            await coin.connect(other).mint(startPrice);
            await coin.connect(other).approve(market.address, startPrice);
            await expect(market.connect(other).bid(nft.address, 0, startPrice))
                .to.emit(market, "Bid")
                .withArgs(nft.address, 0, other.address, startPrice)
            await coin.connect(other).mint(bidPrice);
            await coin.connect(other).approve(market.address, bidPrice);
            await expect(market.connect(other).bid(nft.address, 0, bidPrice))
                .to.emit(market, "Bid")
                .withArgs(nft.address, 0, other.address, bidPrice)
            await mine(100);
            await expect(market.connect(other).claim(nft.address, 0))
                .to.emit(market, "Claim")
                .withArgs(nft.address, 0, other.address, bidPrice)
        })

        it("auction and bid with permit and claim", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const startPrice = expandTo18Decimals(10)
            const bidPrice = expandTo18Decimals(11)
            const endBlock = (await provider.getBlockNumber()) + 100;
            await expect(market.auction(nft.address, 0, startPrice, endBlock))
                .to.emit(market, "Auction")
                .withArgs(nft.address, 0, admin.address, startPrice, endBlock)
            await coin.connect(other).mint(startPrice);

            const nonce1 = await coin.nonces(other.address)
            const deadline = constants.MaxUint256
            const digest1 = await getERC20ApprovalDigest(
                coin,
                { owner: other.address, spender: market.address, value: startPrice },
                nonce1,
                deadline
            )

            const { v: v1, r: r1, s: s1 } = ecsign(Buffer.from(digest1.slice(2), "hex"), Buffer.from(other.privateKey.slice(2), "hex"))

            await expect(market.connect(other).bidWithPermit(nft.address, 0, startPrice, deadline, v1, r1, s1))
                .to.emit(market, "Bid")
                .withArgs(nft.address, 0, other.address, startPrice)
            await coin.connect(other).mint(bidPrice);

            const nonce2 = await coin.nonces(other.address)
            const digest2 = await getERC20ApprovalDigest(
                coin,
                { owner: other.address, spender: market.address, value: bidPrice },
                nonce2,
                deadline
            )

            const { v: v2, r: r2, s: s2 } = ecsign(Buffer.from(digest2.slice(2), "hex"), Buffer.from(other.privateKey.slice(2), "hex"))

            await expect(market.connect(other).bidWithPermit(nft.address, 0, bidPrice, deadline, v2, r2, s2))
                .to.emit(market, "Bid")
                .withArgs(nft.address, 0, other.address, bidPrice)
            await mine(100);
            await expect(market.connect(other).claim(nft.address, 0))
                .to.emit(market, "Claim")
                .withArgs(nft.address, 0, other.address, bidPrice)
        })

        it("auction and cancel", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const startPrice = expandTo18Decimals(10)
            const endBlock = (await provider.getBlockNumber()) + 100;
            await expect(market.auction(nft.address, 0, startPrice, endBlock))
                .to.emit(market, "Auction")
                .withArgs(nft.address, 0, admin.address, startPrice, endBlock)
            await expect(market.cancelAuction(nft.address, 0))
                .to.emit(market, "CancelAuction")
                .withArgs(nft.address, 0, admin.address)
        })
    })
})