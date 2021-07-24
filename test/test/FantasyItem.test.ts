import { waffle } from "hardhat";
import FantasyItemArtifact from "../../artifacts/contracts/test/FantasyItem.sol/FantasyItem.json";
import { FantasyItem } from "../../typechain/FantasyItem";

const { deployContract } = waffle;

describe("FantasyItem", () => {
    let fantasyItem: FantasyItem;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        fantasyItem = await deployContract(
            admin,
            FantasyItemArtifact,
            []
        ) as FantasyItem;
    })

    context("new FantasyItem", async () => {
    })
})