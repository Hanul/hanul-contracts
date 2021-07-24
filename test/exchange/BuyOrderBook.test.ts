import { expect } from "chai";
import { ecsign } from "ethereumjs-util";
import { BigNumber, constants } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { waffle } from "hardhat";
import BuyOrderBookArtifact from "../../artifacts/contracts/exchange/BuyOrderBook.sol/BuyOrderBook.json";
import HanulCoinArtifact from "../../artifacts/contracts/test/HanulCoin.sol/HanulCoin.json";
import { BuyOrderBook } from "../../typechain/BuyOrderBook";
import { HanulCoin } from "../../typechain/HanulCoin";
import { expandTo18Decimals } from "../shared/utils/number";
import { getERC20ApprovalDigest } from "../shared/utils/standard";

const { deployContract } = waffle;

describe("BuyOrderBook", () => {
    let hanulCoin: HanulCoin;
    let buyOrderBook: BuyOrderBook;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        hanulCoin = await deployContract(
            other,
            HanulCoinArtifact,
            []
        ) as HanulCoin;
        buyOrderBook = await deployContract(
            admin,
            BuyOrderBookArtifact,
            [hanulCoin.address]
        ) as BuyOrderBook;
    })

    context("new BuyOrderBook", async () => {
        it("buy", async () => {
            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await expect(buyOrderBook.buy(value, { value: price }))
                .to.emit(buyOrderBook, "Buy")
                .withArgs(0, admin.address, value, price)
            expect(await buyOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await buyOrderBook.count()).to.eq(1)
        })

        it("sell all", async () => {

            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await expect(buyOrderBook.buy(value, { value: price }))
                .to.emit(buyOrderBook, "Buy")
                .withArgs(0, admin.address, value, price)
            expect(await buyOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await buyOrderBook.count()).to.eq(1)

            await hanulCoin.connect(other).approve(buyOrderBook.address, value);
            await expect(buyOrderBook.connect(other).sell(0, value))
                .to.emit(buyOrderBook, "Sell")
                .withArgs(0, other.address, value)
                .to.emit(buyOrderBook, "Remove")
                .withArgs(0)
            expect(await buyOrderBook.get(0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            expect(await hanulCoin.balanceOf(admin.address)).to.eq(value)
        })

        it("sell some", async () => {

            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(2)
            await expect(buyOrderBook.buy(value, { value: price }))
                .to.emit(buyOrderBook, "Buy")
                .withArgs(0, admin.address, value, price)
            expect(await buyOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await buyOrderBook.count()).to.eq(1)

            await hanulCoin.connect(other).approve(buyOrderBook.address, value);

            await expect(buyOrderBook.connect(other).sell(0, expandTo18Decimals(50)))
                .to.emit(buyOrderBook, "Sell")
                .withArgs(0, other.address, expandTo18Decimals(50))
            expect(await buyOrderBook.get(0)).to.deep.eq([admin.address, value.div(2), price.div(2)])

            expect(await hanulCoin.balanceOf(admin.address)).to.eq(value.div(2))

            await expect(buyOrderBook.connect(other).sell(0, expandTo18Decimals(50)))
                .to.emit(buyOrderBook, "Sell")
                .withArgs(0, other.address, expandTo18Decimals(50))
                .to.emit(buyOrderBook, "Remove")
                .withArgs(0)
            expect(await buyOrderBook.get(0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            expect(await hanulCoin.balanceOf(admin.address)).to.eq(value)
        })

        it("sell with permit", async () => {

            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await expect(buyOrderBook.buy(value, { value: price }))
                .to.emit(buyOrderBook, "Buy")
                .withArgs(0, admin.address, value, price)
            expect(await buyOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await buyOrderBook.count()).to.eq(1)

            const nonce = await hanulCoin.nonces(other.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                hanulCoin,
                { owner: other.address, spender: buyOrderBook.address, value },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(other.privateKey.slice(2), "hex"))

            await expect(buyOrderBook.connect(other).sellWithPermit(0, value, deadline, v, hexlify(r), hexlify(s)))
                .to.emit(buyOrderBook, "Sell")
                .withArgs(0, other.address, value)
                .to.emit(buyOrderBook, "Remove")
                .withArgs(0)
            expect(await buyOrderBook.get(0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            expect(await hanulCoin.balanceOf(admin.address)).to.eq(value)
        })

        it("cancel", async () => {
            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await expect(buyOrderBook.buy(value, { value: price }))
                .to.emit(buyOrderBook, "Buy")
                .withArgs(0, admin.address, value, price)
            expect(await buyOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await buyOrderBook.count()).to.eq(1)

            await expect(buyOrderBook.cancel(0))
                .to.emit(buyOrderBook, "Cancel")
                .withArgs(0)
            expect(await buyOrderBook.get(0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            await expect(buyOrderBook.connect(other).sell(0, value)).to.be.reverted
        })
    })
})