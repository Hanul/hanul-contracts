import { waffle } from "hardhat";
import AnimalNFTArtifact from "../../artifacts/contracts/test/AnimalNFT.sol/AnimalNFT.json";
import { AnimalNFT } from "../../typechain/AnimalNFT";

const { deployContract } = waffle;

describe("AnimalNFT", () => {
    let animalNFT: AnimalNFT;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        animalNFT = await deployContract(
            admin,
            AnimalNFTArtifact,
            []
        ) as AnimalNFT;
    })

    context("new AnimalNFT", async () => {
    })
})