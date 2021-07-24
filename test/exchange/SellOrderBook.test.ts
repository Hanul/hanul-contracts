import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import { waffle } from "hardhat";
import SellOrderBookArtifact from "../../artifacts/contracts/exchange/SellOrderBook.sol/SellOrderBook.json";
import HanulCoinArtifact from "../../artifacts/contracts/test/HanulCoin.sol/HanulCoin.json";
import { HanulCoin } from "../../typechain/HanulCoin";
import { SellOrderBook } from "../../typechain/SellOrderBook";
import { expandTo18Decimals } from "../shared/utils/number";

const { deployContract } = waffle;

describe("SellOrderBook", () => {
    let hanulCoin: HanulCoin;
    let sellOrderBook: SellOrderBook;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        hanulCoin = await deployContract(
            admin,
            HanulCoinArtifact,
            []
        ) as HanulCoin;
        sellOrderBook = await deployContract(
            admin,
            SellOrderBookArtifact,
            [hanulCoin.address]
        ) as SellOrderBook;
    })

    context("new SellOrderBook", async () => {
        it("sell", async () => {
            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await hanulCoin.approve(sellOrderBook.address, value);
            await expect(sellOrderBook.sell(value, price))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(0, admin.address, value, price)
            expect(await sellOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count()).to.eq(1)
        })

        it("buy all", async () => {

            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await hanulCoin.approve(sellOrderBook.address, value);
            await expect(sellOrderBook.sell(value, price))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(0, admin.address, value, price)
            expect(await sellOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count()).to.eq(1)

            await expect(sellOrderBook.connect(other).buy(0, { value: expandTo18Decimals(1) }))
                .to.emit(sellOrderBook, "Buy")
                .withArgs(0, other.address, expandTo18Decimals(100))
                .to.emit(sellOrderBook, "Remove")
                .withArgs(0)
            expect(await sellOrderBook.get(0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            expect(await hanulCoin.balanceOf(other.address)).to.eq(value)
        })

        it("buy some", async () => {

            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(2)
            await hanulCoin.approve(sellOrderBook.address, value);
            await expect(sellOrderBook.sell(value, price))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(0, admin.address, value, price)
            expect(await sellOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count()).to.eq(1)

            await expect(sellOrderBook.connect(other).buy(0, { value: expandTo18Decimals(1) }))
                .to.emit(sellOrderBook, "Buy")
                .withArgs(0, other.address, expandTo18Decimals(50))
            expect(await sellOrderBook.get(0)).to.deep.eq([admin.address, value.div(2), price.div(2)])

            expect(await hanulCoin.balanceOf(other.address)).to.eq(value.div(2))

            await expect(sellOrderBook.connect(other).buy(0, { value: expandTo18Decimals(1) }))
                .to.emit(sellOrderBook, "Buy")
                .withArgs(0, other.address, expandTo18Decimals(50))
                .to.emit(sellOrderBook, "Remove")
                .withArgs(0)
            expect(await sellOrderBook.get(0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            expect(await hanulCoin.balanceOf(other.address)).to.eq(value)
        })

        it("cancel", async () => {
            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await hanulCoin.approve(sellOrderBook.address, value);
            await expect(sellOrderBook.sell(value, price))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(0, admin.address, value, price)
            expect(await sellOrderBook.get(0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count()).to.eq(1)

            await expect(sellOrderBook.cancel(0))
                .to.emit(sellOrderBook, "Cancel")
                .withArgs(0)
            expect(await sellOrderBook.get(0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            await expect(sellOrderBook.connect(other).buy(0, { value: expandTo18Decimals(1) })).to.be.reverted
        })
    })
})