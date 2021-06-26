import { expect } from "chai";
import { BigNumber } from "ethers";
import { waffle } from "hardhat";
import SkyUtil from "skyutil";
import RNGArtifact from "../../artifacts/contracts/rng/RNG.sol/RNG.json";
import RNGTestArtifact from "../../artifacts/contracts/test/RNGTest.sol/RNGTest.json";
import { RNG } from "../../typechain/RNG";
import { RNGTest } from "../../typechain/RNGTest";

const { deployContract } = waffle;

describe("RNGTest", () => {
    let rng: RNG;
    let rngTest: RNGTest;

    const provider = waffle.provider;
    const [admin] = provider.getWallets();

    beforeEach(async () => {
        rng = await deployContract(
            admin,
            RNGArtifact,
            []
        ) as RNG;
        rngTest = await deployContract(
            admin,
            RNGTestArtifact,
            [rng.address]
        ) as RNGTest;
    })

    context("new RNGTest", async () => {
        it("generate random number", async () => {

            let number, before = BigNumber.from(0);

            await SkyUtil.repeatAsync(10, async () => {
                await rngTest.generate(1);
                expect(number = await rngTest.number()).not.to.eq(before);
                console.log(number.toHexString());
                before = number;
            });
        })
    })
})