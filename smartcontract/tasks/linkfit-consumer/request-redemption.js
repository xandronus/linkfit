
let { networkConfig, getNetworkIdFromName } = require('../../helper-hardhat-config')

task("request-redemption", "Calls an LinkFitToken contract to request external data")
    .addParam("contract", "The address of the LinkFitToken contract that you want to call")
    .addParam("recipient", "The address of the LinkFitToken recepient")
    .setAction(async taskArgs => {

        const contractAddr = taskArgs.contract
        const recipientAddr = taskArgs.recipient
        let networkId = await getNetworkIdFromName(network.name)
        console.log("Calling LinkFitToken contract ", contractAddr, " on network ", network.name)
        const LinkFitToken = await ethers.getContractFactory("LinkFitToken")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to LinkFitToken Contract and call the requestRedemption function
        const linkFitContract = new ethers.Contract(contractAddr, LinkFitToken.interface, signer)
        var result = await linkFitContract.requestRedemption(recipientAddr).then(function (transaction) {
            console.log('Contract ', contractAddr, ' external data request successfully called. Transaction Hash: ', transaction.hash)
        })
    })
module.exports = {}
