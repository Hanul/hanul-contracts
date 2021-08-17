import { Contract } from "@ethersproject/contracts";
import { expect } from "chai";
import { waffle } from "hardhat";
import EmittableTokenArtifact from "../../artifacts/contracts/emitter/EmittableToken.sol/EmittableToken.json";
import EmitterArtifact from "../../artifacts/contracts/emitter/Emitter.sol/Emitter.json";
import { EmittableToken } from "../../typechain";
import { Emitter } from "../../typechain/Emitter";
import { mine } from "../shared/utils/blockchain";

const { deployContract } = waffle;

describe("Emitter", () => {

    let emitter: Emitter;
    let token: EmittableToken;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {

        emitter = await deployContract(
            admin,
            EmitterArtifact,
            ["Test Emitter Token", "TEST", 100, (await provider.getBlockNumber()) + 100]
        ) as Emitter;

        token = (new Contract(await emitter.token(), EmittableTokenArtifact.abi, provider) as EmittableToken).connect(admin);
    })

    context("new Emitter", async () => {
        it("add", async () => {

            await expect(emitter.add(admin.address, 100))
                .to.emit(emitter, "Add")
                .withArgs(admin.address, 100)

            await mine(96)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(0)

            await mine(1)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(110) // +10%

            await mine(3)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(550) // +10%
        });

        it("add twice", async () => {

            await emitter.add(admin.address, 100);
            await emitter.add(other.address, 100);

            await mine(95)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(0)

            await mine(1)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(55) // +10%

            await mine(3)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(275) // +10%
        });

        it("set", async () => {

            await emitter.add(admin.address, 100);
            await emitter.add(other.address, 100);

            await mine(95)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(0)

            await mine(1)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(55) // +10%

            await expect(emitter.set(1, 200))
                .to.emit(emitter, "Set")
                .withArgs(1, 200)

            await mine(2)
            await emitter.updatePool(0);
            expect(await token.balanceOf(admin.address)).to.equal(230) // +10%
        });
    })
})