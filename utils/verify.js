const { run } = require("hardhat")

async function verify(contractAddress, args) {
    console.log("Verifying Contract")
    try {
        //verify checks the contract data against the code from the contract 
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (err) {
        if (err.message.toLowerCase().includes("already been verified")) {
            console.log("Already Verified")
        } else {
            console.log(err)
        }
    }
}

module.exports = { verify }
