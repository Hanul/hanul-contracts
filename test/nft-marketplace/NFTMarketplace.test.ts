import { expect } from "chai";
import { waffle } from "hardhat";
import NFTMarketplaceArtifact from "../../artifacts/contracts/nft-marketplace/NFTMarketplace.sol/NFTMarketplace.json";
import AnimalNFTArtifact from "../../artifacts/contracts/test/AnimalNFT.sol/AnimalNFT.json";
import { AnimalNFT, NFTMarketplace } from "../../typechain";
import { mine } from "../shared/utils/blockchain";
import { expandTo18Decimals } from "../shared/utils/number";

const { deployContract } = waffle;

describe("NFTMarketplace", () => {
    let nft: AnimalNFT;
    let market: NFTMarketplace;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        nft = await deployContract(
            admin,
            AnimalNFTArtifact,
            []
        ) as AnimalNFT;
        market = await deployContract(
            admin,
            NFTMarketplaceArtifact,
            []
        ) as NFTMarketplace;
    })

    context("new NFTMarketplace", async () => {
        it("sell and buy", async () => {
            await nft.mint("Cat")
            await nft.approve(market.address, 0)
            const price = expandTo18Decimals(10)
            await expect(market.sell(nft.address, 0, price))
                .to.emit(market, "Sell")
                .withArgs(nft.address, 0, admin.address, price)
            await expect(market.connect(other).buy(nft.address, 0, { value: price }))
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
            await expect(market.connect(other).offer(nft.address, 0, { value: price }))
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
            await expect(market.connect(other).offer(nft.address, 0, { value: price }))
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
            await expect(market.connect(other).bid(nft.address, 0, { value: startPrice }))
                .to.emit(market, "Bid")
                .withArgs(nft.address, 0, other.address, startPrice)
            await expect(market.connect(other).bid(nft.address, 0, { value: bidPrice }))
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