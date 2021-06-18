import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { waffle } from "hardhat";
import FungibleTokenArtifact from "../../artifacts/contracts/token/FungibleToken.sol/FungibleToken.json";
import { FungibleToken } from "../../typechain/FungibleToken";
import { expandTo18Decimals, getERC20ApprovalDigest } from "../shared/utilities";
import { ecsign } from "ethereumjs-util";

const { deployContract } = waffle;

describe("FungibleToken", () => {
    let fungibleToken: FungibleToken;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets()

    beforeEach(async () => {
        fungibleToken = await deployContract(
            admin,
            FungibleTokenArtifact,
            [
                "FungibleToken",
                "FT",
            ]
        ) as FungibleToken;
    })

    context("new FungibleToken", async () => {
        it("has given data", async () => {
            expect(await fungibleToken.totalSupply()).to.be.equal(0)
            expect(await fungibleToken.name()).to.be.equal("FungibleToken")
            expect(await fungibleToken.symbol()).to.be.equal("FT")
            expect(await fungibleToken.decimals()).to.be.equal(18)
        })

        it("check the deployer balance", async () => {
            expect(await fungibleToken.balanceOf(admin.address)).to.be.equal(0)
        })

        it("data for permit", async () => {
            expect(await fungibleToken.DOMAIN_SEPARATOR()).to.eq(
                keccak256(
                    defaultAbiCoder.encode(
                        ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                        [
                            keccak256(
                                toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
                            ),
                            keccak256(toUtf8Bytes("FungibleToken")),
                            keccak256(toUtf8Bytes("1")),
                            31337,
                            fungibleToken.address
                        ]
                    )
                )
            )
            expect(await fungibleToken.PERMIT_TYPEHASH()).to.eq(
                keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"))
            )
        })

        it("permit", async () => {
            const value = expandTo18Decimals(10)

            const nonce = await fungibleToken.nonces(admin.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                fungibleToken,
                { owner: admin.address, spender: other.address, value },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(admin.privateKey.slice(2), "hex"))

            await expect(fungibleToken.permit(admin.address, other.address, value, deadline, v, hexlify(r), hexlify(s)))
                .to.emit(fungibleToken, "Approval")
                .withArgs(admin.address, other.address, value)
            expect(await fungibleToken.allowance(admin.address, other.address)).to.eq(value)
            expect(await fungibleToken.nonces(admin.address)).to.eq(BigNumber.from(1))
        })
    })
})