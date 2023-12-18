// function deployFunc() {
//     console.log("Hi")
// }
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
// const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    //if no contract exits deplot minimal version of it for our local testing
    //when working with localhost and hardhat networks we need to use a mock
    const fundMe = await deploy("FundMe", {
        // from: deployer,
        args: args,
        from: deployer, //put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("____________________")
}

module.exports.tags = ["all", "fundme"]
