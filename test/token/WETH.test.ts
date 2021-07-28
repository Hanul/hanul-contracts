import { expect } from "chai";
import { ecsign } from "ethereumjs-util";
import { BigNumber, constants } from "ethers";
import { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { waffle } from "hardhat";
import WETHArtifact from "../../artifacts/contracts/token/WETH.sol/WETH.json";
import { WETH } from "../../typechain/WETH";
import { expandTo18Decimals } from "../shared/utils/number";
import { getERC20ApprovalDigest } from "../shared/utils/standard";

const { deployContract } = waffle;

describe("WETH", () => {
    let weth: WETH;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    const name = "Wrapped Ether";
    const symbol = "WETH";
    const version = "1";

    beforeEach(async () => {
        weth = await deployContract(
            admin,
            WETHArtifact,
            []
        ) as WETH;
    })

    context("new WETH", async () => {
        it("has given data", async () => {
            expect(await weth.totalSupply()).to.be.equal(0)
            expect(await weth.name()).to.be.equal(name)
            expect(await weth.symbol()).to.be.equal(symbol)
            expect(await weth.decimals()).to.be.equal(18)
            expect(await weth.version()).to.be.equal(version)
        })

        it("check the deployer balance", async () => {
            expect(await weth.balanceOf(admin.address)).to.be.equal(0)
        })

        it("deposit", async () => {
            await weth.deposit({ value: 100 });
            expect(await weth.balanceOf(admin.address)).to.be.equal(100)
            expect(await provider.getBalance(weth.address)).to.be.equal(100)
        })

        it("deposit eth", async () => {
            await admin.sendTransaction({ to: weth.address, value: 100 });
            expect(await weth.balanceOf(admin.address)).to.be.equal(100)
            expect(await provider.getBalance(weth.address)).to.be.equal(100)
        })

        it("withdraw", async () => {
            await weth.deposit({ value: 100 });
            expect(await weth.balanceOf(admin.address)).to.be.equal(100)
            expect(await provider.getBalance(weth.address)).to.be.equal(100)
            await weth.withdraw(100);
            expect(await weth.balanceOf(admin.address)).to.be.equal(0)
            expect(await provider.getBalance(weth.address)).to.be.equal(0)
        })

        it("withdraw eth", async () => {
            await admin.sendTransaction({ to: weth.address, value: 100 });
            expect(await weth.balanceOf(admin.address)).to.be.equal(100)
            expect(await provider.getBalance(weth.address)).to.be.equal(100)
            await weth.withdraw(100);
            expect(await weth.balanceOf(admin.address)).to.be.equal(0)
            expect(await provider.getBalance(weth.address)).to.be.equal(0)
        })

        it("data for permit", async () => {
            expect(await weth.DOMAIN_SEPARATOR()).to.eq(
                keccak256(
                    defaultAbiCoder.encode(
                        ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                        [
                            keccak256(
                                toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
                            ),
                            keccak256(toUtf8Bytes(name)),
                            keccak256(toUtf8Bytes(version)),
                            31337,
                            weth.address
                        ]
                    )
                )
            )
            expect(await weth.PERMIT_TYPEHASH()).to.eq(
                keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"))
            )
        })

        it("permit", async () => {
            const value = expandTo18Decimals(10)

            const nonce = await weth.nonces(admin.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                weth,
                { owner: admin.address, spender: other.address, value },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(admin.privateKey.slice(2), "hex"))

            await expect(weth.permit(admin.address, other.address, value, deadline, v, hexlify(r), hexlify(s)))
                .to.emit(weth, "Approval")
                .withArgs(admin.address, other.address, value)
            expect(await weth.allowance(admin.address, other.address)).to.eq(value)
            expect(await weth.nonces(admin.address)).to.eq(BigNumber.from(1))
        })
    })
})