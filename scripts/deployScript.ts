import hardhat from 'hardhat';

async function main() {
    console.log("deploy start")

    const FungibleToken = await hardhat.ethers.getContractFactory("FungibleToken")
    const fungibleToken = await FungibleToken.deploy(
        "FungibleToken",
        "FT",
    )
    console.log(`FungibleToken address:${fungibleToken.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
