import { expect } from "chai";
import { ecsign } from "ethereumjs-util";
import { BigNumber, constants } from "ethers";
import { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { waffle } from "hardhat";
import FungibleTokenArtifact from "../../artifacts/contracts/token/FungibleToken.sol/FungibleToken.json";
import { FungibleToken } from "../../typechain/FungibleToken";
import { expandTo18Decimals } from "../shared/utils/number";
import { getERC20ApprovalDigest } from "../shared/utils/standard";

const { deployContract } = waffle;

describe("FungibleToken", () => {
    let token: FungibleToken;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    const name = "FungibleToken";
    const symbol = "FT";
    const version = "1";

    beforeEach(async () => {
        token = await deployContract(
            admin,
            FungibleTokenArtifact,
            [name, symbol, version]
        ) as FungibleToken;
    })

    context("new FungibleToken", async () => {
        it("has given data", async () => {
            expect(await token.totalSupply()).to.be.equal(0)
            expect(await token.name()).to.be.equal(name)
            expect(await token.symbol()).to.be.equal(symbol)
            expect(await token.decimals()).to.be.equal(18)
            expect(await token.version()).to.be.equal(version)
        })

        it("check the deployer balance", async () => {
            expect(await token.balanceOf(admin.address)).to.be.equal(0)
        })

        it("data for permit", async () => {
            expect(await token.DOMAIN_SEPARATOR()).to.eq(
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
                            token.address
                        ]
                    )
                )
            )
            expect(await token.PERMIT_TYPEHASH()).to.eq(
                keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"))
            )
        })

        it("permit", async () => {
            const value = expandTo18Decimals(10)

            const nonce = await token.nonces(admin.address)
            const deadline = constants.MaxUint256
            const digest = await getERC20ApprovalDigest(
                token,
                { owner: admin.address, spender: other.address, value },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(admin.privateKey.slice(2), "hex"))

            await expect(token.permit(admin.address, other.address, value, deadline, v, hexlify(r), hexlify(s)))
                .to.emit(token, "Approval")
                .withArgs(admin.address, other.address, value)
            expect(await token.allowance(admin.address, other.address)).to.eq(value)
            expect(await token.nonces(admin.address)).to.eq(BigNumber.from(1))
        })
    })
})