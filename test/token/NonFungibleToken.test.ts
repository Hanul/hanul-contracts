import { expect } from "chai";
import { waffle } from "hardhat";
import NonFungibleTokenArtifact from "../../artifacts/contracts/token/NonFungibleToken.sol/NonFungibleToken.json";
import { NonFungibleToken } from "../../typechain/NonFungibleToken";

const { deployContract } = waffle;

describe("NonFungibleToken", () => {
    let nft: NonFungibleToken;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    const name = "NonFungibleToken";
    const symbol = "NFT";
    const version = "1";

    beforeEach(async () => {
        nft = await deployContract(
            admin,
            NonFungibleTokenArtifact,
            [name, symbol, version]
        ) as NonFungibleToken;
    })

    context("new NonFungibleToken", async () => {
        it("has given data", async () => {
            expect(await nft.name()).to.be.equal(name)
            expect(await nft.symbol()).to.be.equal(symbol)
            expect(await nft.version()).to.be.equal(version)
        })
    })
})