let { networkConfig } = require('../helper-hardhat-config')

module.exports = async ({
  getNamedAccounts,
  deployments
}) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()
  let linkTokenAddress
  let oracle
  let additionalMessage = ""

  if (chainId == 31337) {
    linkToken = await get('LinkToken')
    MockOracle = await get('MockOracle')
    linkTokenAddress = linkToken.address
    oracle = MockOracle.address
    additionalMessage = " --linkaddress " + linkTokenAddress
  } else {
    linkTokenAddress = networkConfig[chainId]['linkToken']
    oracle = networkConfig[chainId]['oracle']
  }
  const jobId = networkConfig[chainId]['jobId']
  const fee = networkConfig[chainId]['fee']

  const linkfit = await deploy('LinkFitToken', {
    from: deployer,
    args: [oracle, jobId, fee, linkTokenAddress, "https://linkfit.vercel.app/api"],
    log: true
  })

  log("Run the following command to fund contract with LINK:")
  log("npx hardhat fund-link --contract " + linkfit.address + " --network " + networkConfig[chainId]['name'] + additionalMessage)
  log("Then run LinkFitToken contract with following command:")
  log("npx hardhat request-redemption --contract " + linkfit.address + " --recipient {receipientAddr}" + " --network " + networkConfig[chainId]['name'])
  log("----------------------------------------------------")
}

module.exports.tags = ['all', 'linkfit']
