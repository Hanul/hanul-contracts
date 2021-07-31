import { waffle } from "hardhat";
import SwaperArtifact from "../../artifacts/contracts/swap/Swaper.sol/Swaper.json";
import HanulCoinArtifact from "../../artifacts/contracts/test/HanulCoin.sol/HanulCoin.json";
import { HanulCoin } from "../../typechain/HanulCoin";
import { Swaper } from "../../typechain/Swaper";

const { deployContract } = waffle;

describe("Swaper", () => {
    let coin1: HanulCoin;
    let coin2: HanulCoin;
    let swaper: Swaper;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        coin1 = await deployContract(
            other,
            HanulCoinArtifact,
            []
        ) as HanulCoin;
        coin2 = await deployContract(
            other,
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
    })
})