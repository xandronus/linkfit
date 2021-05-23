
task("get-steps", "Calls an LinkFitToken Contract to read step data obtained from an external API")
    .addParam("contract", "The address of the LinkFitToken contract that you want to call")
    .addParam("recipient", "The address of the LinkFitToken recepient")
    .setAction(async taskArgs => {

        const contractAddr = taskArgs.contract
        const recipientAddr = taskArgs.recipient
        const networkId = network.name
        console.log("Reading data from LinkFitToken contract ", contractAddr, " on network ", networkId)
        const LinkFitToken = await ethers.getContractFactory("LinkFitToken")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to LinkFitToken Contract and call the getSteps function
        const linkFitTokenContract = new ethers.Contract(contractAddr, LinkFitToken.interface, signer)
        let result = BigInt(await linkFitTokenContract.getSteps(recipientAddr)).toString()
        console.log('Data is: ', result)
        if (result == 0 && ['hardhat', 'localhost', 'ganache'].indexOf(network.name) == 0) {
            console.log("You'll either need to wait another minute, or fix something!")
        }
        if (['hardhat', 'localhost', 'ganache'].indexOf(network.name) >= 0) {
            console.log("You'll have to manually update the value since you're on a local chain!")
        }
    })

module.exports = {}
