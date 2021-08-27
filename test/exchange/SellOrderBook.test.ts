import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import { ecsign } from "ethereumjs-util";
import { constants } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { waffle } from "hardhat";
import SellOrderBookArtifact from "../../artifacts/contracts/exchange/SellOrderBook.sol/SellOrderBook.json";
import HanulCoinArtifact from "../../artifacts/contracts/test/HanulCoin.sol/HanulCoin.json";
import { HanulCoin } from "../../typechain/HanulCoin";
import { SellOrderBook } from "../../typechain/SellOrderBook";
import { expandTo18Decimals } from "../shared/utils/number";
import { getERC20ApprovalDigest } from "../shared/utils/standard";

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
            []
        ) as SellOrderBook;
    })

    context("new SellOrderBook", async () => {
        it("sell", async () => {
            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await hanulCoin.approve(sellOrderBook.address, value);
            await expect(sellOrderBook.sell(hanulCoin.address, value, price))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(hanulCoin.address, 0, admin.address, value, price)
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count(hanulCoin.address)).to.eq(1)
        })

        it("sell with permit", async () => {
            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)

            const nonce = await hanulCoin.nonces(admin.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                hanulCoin,
                { owner: admin.address, spender: sellOrderBook.address, value },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(admin.privateKey.slice(2), "hex"))

            await expect(sellOrderBook.sellWithPermit(hanulCoin.address, value, price, deadline, v, hexlify(r), hexlify(s)))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(hanulCoin.address, 0, admin.address, value, price)
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count(hanulCoin.address)).to.eq(1)
        })

        it("buy all", async () => {

            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await hanulCoin.approve(sellOrderBook.address, value);
            await expect(sellOrderBook.sell(hanulCoin.address, value, price))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(hanulCoin.address, 0, admin.address, value, price)
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count(hanulCoin.address)).to.eq(1)

            await expect(sellOrderBook.connect(other).buy(hanulCoin.address, 0, { value: expandTo18Decimals(1) }))
                .to.emit(sellOrderBook, "Buy")
                .withArgs(hanulCoin.address, 0, other.address, expandTo18Decimals(100))
                .to.emit(sellOrderBook, "Remove")
                .withArgs(hanulCoin.address, 0)
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            expect(await hanulCoin.balanceOf(other.address)).to.eq(value)
        })

        it("buy some", async () => {

            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(2)
            await hanulCoin.approve(sellOrderBook.address, value);
            await expect(sellOrderBook.sell(hanulCoin.address, value, price))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(hanulCoin.address, 0, admin.address, value, price)
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count(hanulCoin.address)).to.eq(1)

            await expect(sellOrderBook.connect(other).buy(hanulCoin.address, 0, { value: expandTo18Decimals(1) }))
                .to.emit(sellOrderBook, "Buy")
                .withArgs(hanulCoin.address, 0, other.address, expandTo18Decimals(50))
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq([admin.address, value.div(2), price.div(2)])

            expect(await hanulCoin.balanceOf(other.address)).to.eq(value.div(2))

            await expect(sellOrderBook.connect(other).buy(hanulCoin.address, 0, { value: expandTo18Decimals(1) }))
                .to.emit(sellOrderBook, "Buy")
                .withArgs(hanulCoin.address, 0, other.address, expandTo18Decimals(50))
                .to.emit(sellOrderBook, "Remove")
                .withArgs(hanulCoin.address, 0)
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            expect(await hanulCoin.balanceOf(other.address)).to.eq(value)
        })

        it("cancel", async () => {
            const value = expandTo18Decimals(100)
            const price = expandTo18Decimals(1)
            await hanulCoin.approve(sellOrderBook.address, value);
            await expect(sellOrderBook.sell(hanulCoin.address, value, price))
                .to.emit(sellOrderBook, "Sell")
                .withArgs(hanulCoin.address, 0, admin.address, value, price)
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq([admin.address, value, price])
            expect(await sellOrderBook.count(hanulCoin.address)).to.eq(1)

            await expect(sellOrderBook.cancel(hanulCoin.address, 0))
                .to.emit(sellOrderBook, "Cancel")
                .withArgs(hanulCoin.address, 0)
            expect(await sellOrderBook.get(hanulCoin.address, 0)).to.deep.eq(["0x0000000000000000000000000000000000000000", BigNumber.from(0), BigNumber.from(0)])

            await expect(sellOrderBook.connect(other).buy(hanulCoin.address, 0, { value: expandTo18Decimals(1) })).to.be.reverted
        })
    })
})