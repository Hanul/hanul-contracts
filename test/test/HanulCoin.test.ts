import { expect } from "chai";
import { ecsign } from "ethereumjs-util";
import { BigNumber, constants } from "ethers";
import { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { waffle } from "hardhat";
import HanulCoinArtifact from "../../artifacts/contracts/test/HanulCoin.sol/HanulCoin.json";
import { HanulCoin } from "../../typechain/HanulCoin";
import { expandTo18Decimals, getERC20ApprovalDigest } from "../shared/utilities";

const { deployContract } = waffle;

describe("HanulCoin", () => {
    let hanulCoin: HanulCoin;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets()
    const totalSupply = expandTo18Decimals(1988);

    beforeEach(async () => {
        hanulCoin = await deployContract(
            admin,
            HanulCoinArtifact,
            []
        ) as HanulCoin;
    })

    context("new HanulCoin", async () => {
        it("has given data", async () => {
            expect(await hanulCoin.totalSupply()).to.be.equal(totalSupply)
            expect(await hanulCoin.name()).to.be.equal("HanulCoin")
            expect(await hanulCoin.symbol()).to.be.equal("HANUL")
            expect(await hanulCoin.decimals()).to.be.equal(18)
        })

        it("check the deployer balance", async () => {
            expect(await hanulCoin.balanceOf(admin.address)).to.be.equal(totalSupply)
        })

        it("approve", async () => {
            const value = expandTo18Decimals(10)
            await expect(hanulCoin.approve(other.address, value))
                .to.emit(hanulCoin, "Approval")
                .withArgs(admin.address, other.address, value)
            expect(await hanulCoin.allowance(admin.address, other.address)).to.eq(value)
        })

        it("transfer", async () => {
            const value = expandTo18Decimals(10)
            await expect(hanulCoin.transfer(other.address, value))
                .to.emit(hanulCoin, "Transfer")
                .withArgs(admin.address, other.address, value)
            expect(await hanulCoin.balanceOf(admin.address)).to.eq(totalSupply.sub(value))
            expect(await hanulCoin.balanceOf(other.address)).to.eq(value)
        })

        it("transfer:fail", async () => {
            await expect(hanulCoin.transfer(other.address, totalSupply.add(1))).to.be.reverted // ds-math-sub-underflow
            await expect(hanulCoin.connect(other).transfer(admin.address, 1)).to.be.reverted // ds-math-sub-underflow
        })

        it("transferFrom", async () => {
            const value = expandTo18Decimals(10)
            await hanulCoin.approve(other.address, value)
            await expect(hanulCoin.connect(other).transferFrom(admin.address, other.address, value))
                .to.emit(hanulCoin, "Transfer")
                .withArgs(admin.address, other.address, value)
            expect(await hanulCoin.allowance(admin.address, other.address)).to.eq(0)
            expect(await hanulCoin.balanceOf(admin.address)).to.eq(totalSupply.sub(value))
            expect(await hanulCoin.balanceOf(other.address)).to.eq(value)
        })

        it("transferFrom:max", async () => {
            const value = expandTo18Decimals(10)
            await hanulCoin.approve(other.address, constants.MaxUint256)
            await expect(hanulCoin.connect(other).transferFrom(admin.address, other.address, value))
                .to.emit(hanulCoin, "Transfer")
                .withArgs(admin.address, other.address, value)
            expect(await hanulCoin.allowance(admin.address, other.address)).to.eq(constants.MaxUint256)
            expect(await hanulCoin.balanceOf(admin.address)).to.eq(totalSupply.sub(value))
            expect(await hanulCoin.balanceOf(other.address)).to.eq(value)
        })

        it("mint", async () => {
            const value = expandTo18Decimals(10)
            await expect(hanulCoin.mint(value))
                .to.emit(hanulCoin, "Transfer")
                .withArgs(constants.AddressZero, admin.address, value)
            expect(await hanulCoin.balanceOf(admin.address)).to.eq(totalSupply.add(value))
        })

        it("burn", async () => {
            const value = expandTo18Decimals(10)
            await expect(hanulCoin.transfer(other.address, value))
                .to.emit(hanulCoin, "Transfer")
                .withArgs(admin.address, other.address, value)
            expect(await hanulCoin.balanceOf(other.address)).to.eq(value)
            await expect(await hanulCoin.connect(other).burn(value))
                .to.emit(hanulCoin, "Transfer")
                .withArgs(other.address, constants.AddressZero, value)
            expect(await hanulCoin.balanceOf(other.address)).to.eq(0)
        })

        it("data for permit", async () => {
            expect(await hanulCoin.DOMAIN_SEPARATOR()).to.eq(
                keccak256(
                    defaultAbiCoder.encode(
                        ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                        [
                            keccak256(
                                toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
                            ),
                            keccak256(toUtf8Bytes("HanulCoin")),
                            keccak256(toUtf8Bytes("1")),
                            31337,
                            hanulCoin.address
                        ]
                    )
                )
            )
            expect(await hanulCoin.PERMIT_TYPEHASH()).to.eq(
                keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"))
            )
        })

        it("permit", async () => {
            const value = expandTo18Decimals(10)

            const nonce = await hanulCoin.nonces(admin.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                hanulCoin,
                { owner: admin.address, spender: other.address, value },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(admin.privateKey.slice(2), "hex"))

            await expect(hanulCoin.permit(admin.address, other.address, value, deadline, v, hexlify(r), hexlify(s)))
                .to.emit(hanulCoin, "Approval")
                .withArgs(admin.address, other.address, value)
            expect(await hanulCoin.allowance(admin.address, other.address)).to.eq(value)
            expect(await hanulCoin.nonces(admin.address)).to.eq(BigNumber.from(1))
        })
    })
})