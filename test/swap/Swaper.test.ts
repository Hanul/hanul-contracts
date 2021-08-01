import { Contract } from "@ethersproject/contracts";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { waffle } from "hardhat";
import SwaperArtifact from "../../artifacts/contracts/swap/Swaper.sol/Swaper.json";
import TokenPairArtifact from "../../artifacts/contracts/swap/TokenPair.sol/TokenPair.json";
import HanulCoinArtifact from "../../artifacts/contracts/test/HanulCoin.sol/HanulCoin.json";
import { TokenPair } from "../../typechain";
import { HanulCoin } from "../../typechain/HanulCoin";
import { Swaper } from "../../typechain/Swaper";
import { expandTo18Decimals } from "../shared/utils/number";

const { deployContract } = waffle;

describe("Swaper", () => {
    let coin1: HanulCoin;
    let coin2: HanulCoin;
    let swaper: Swaper;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        coin1 = await deployContract(
            admin,
            HanulCoinArtifact,
            []
        ) as HanulCoin;
        coin2 = await deployContract(
            admin,
            HanulCoinArtifact,
            []
        ) as HanulCoin;
        swaper = await deployContract(
            admin,
            SwaperArtifact,
            []
        ) as Swaper;
    })

    context("new Swaper", async () => {
        it("add liquidity", async () => {
            const amount1 = expandTo18Decimals(120)
            const amount2 = expandTo18Decimals(100)

            await coin1.approve(swaper.address, amount1);
            await coin2.approve(swaper.address, amount2);

            await expect(swaper.addLiquidity(coin1.address, amount1, coin2.address, amount2))
                .to.emit(swaper, "CreatePair")

            const pairAddress = await swaper.getPair(coin1.address, coin2.address);
            const pair = new Contract(pairAddress, TokenPairArtifact.abi, provider) as TokenPair;

            expect(await pair.balanceOf(admin.address)).to.eq(BigNumber.from("109544511501033221691"));

            expect(await coin1.balanceOf(pairAddress)).to.eq(amount1);
            expect(await coin2.balanceOf(pairAddress)).to.eq(amount2);

            const amount3 = expandTo18Decimals(10)
            const amount4 = expandTo18Decimals(20)

            await coin1.approve(swaper.address, amount3);
            await coin2.approve(swaper.address, amount4);

            await expect(swaper.addLiquidity(coin1.address, amount3, coin2.address, amount4))
                .to.emit(pair, "AddLiquidity")
                .withArgs(
                    admin.address,
                    BigNumber.from("118673220792785990248").sub(BigNumber.from("109544511501033221691")),
                    amount3,
                    amount2.mul(amount3).div(amount1)
                )

            expect(await pair.balanceOf(admin.address)).to.eq(BigNumber.from("118673220792785990248"));

            expect(await coin1.balanceOf(pairAddress)).to.eq(amount1.add(amount3));
            expect(await coin2.balanceOf(pairAddress)).to.eq(amount2.add(amount2.mul(amount3).div(amount1)));
        })

        it("subtract liquidity", async () => {
            const amount1 = expandTo18Decimals(120)
            const amount2 = expandTo18Decimals(100)

            await coin1.approve(swaper.address, amount1);
            await coin2.approve(swaper.address, amount2);

            await expect(swaper.addLiquidity(coin1.address, amount1, coin2.address, amount2))
                .to.emit(swaper, "CreatePair")

            const pairAddress = await swaper.getPair(coin1.address, coin2.address);
            const pair = new Contract(pairAddress, TokenPairArtifact.abi, provider) as TokenPair;

            expect(await pair.balanceOf(admin.address)).to.eq(BigNumber.from("109544511501033221691"));

            expect(await coin1.balanceOf(pairAddress)).to.eq(amount1);
            expect(await coin2.balanceOf(pairAddress)).to.eq(amount2);

            const amount3 = expandTo18Decimals(10)
            const amount4 = expandTo18Decimals(20)

            await coin1.approve(swaper.address, amount3);
            await coin2.approve(swaper.address, amount4);

            await expect(swaper.addLiquidity(coin1.address, amount3, coin2.address, amount4))
                .to.emit(pair, "AddLiquidity")
                .withArgs(
                    admin.address,
                    BigNumber.from("118673220792785990248").sub(BigNumber.from("109544511501033221691")),
                    amount2.mul(amount3).div(amount1),
                    amount3
                )

            expect(await pair.balanceOf(admin.address)).to.eq(BigNumber.from("118673220792785990248"));

            expect(await coin1.balanceOf(pairAddress)).to.eq(amount1.add(amount3));
            expect(await coin2.balanceOf(pairAddress)).to.eq(amount2.add(amount2.mul(amount3).div(amount1)));

            const liquidity = expandTo18Decimals(10)
            await expect(swaper.subtractLiquidity(coin1.address, coin2.address, liquidity))
                .to.emit(pair, "SubtractLiquidity")

            expect(await pair.balanceOf(admin.address)).to.eq(BigNumber.from("108673220792785990248"));
        })
    })
})