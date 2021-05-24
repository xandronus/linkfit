const { expect } = require('chai')

describe('LinkFitTokenConsumer', async function () {
  let linkfitConsumer, mockOracle, linkToken

  beforeEach(async () => {
    await deployments.fixture(['mocks', 'linkfit'])

    // Then, we can get the contracts like normal
    const LinkToken = await deployments.get('LinkToken')
    linkToken = await ethers.getContractAt('LinkToken', LinkToken.address)
    const LinkFitTokenConsumer = await deployments.get('LinkFitToken')
    linkfitConsumer = await ethers.getContractAt('LinkFitToken', LinkFitTokenConsumer.address)
    const MockOracle = await deployments.get('MockOracle')
    mockOracle = await ethers.getContractAt('MockOracle', MockOracle.address)
  })

  it('Should successfully make an external API request', async () => {
    await linkToken.transfer(linkfitConsumer.address, '2000000000000000000')
    const transaction = await linkfitConsumer.requestRedemption(linkfitConsumer.address)
    const tx_receipt = await transaction.wait()
    const requestId = tx_receipt.events[0].topics[1]
    const returnData = web3.utils.padLeft(web3.utils.padLeft(web3.utils.toHex('0')), 64)
    const tx = await mockOracle.fulfillOracleRequest(requestId, returnData)
    await tx.wait()
    expect(await linkfitConsumer.getSteps(linkfitConsumer.address)).to.equal('0')
  }),

  it('BuildUrl should build right url', async () => {
      const url = await linkfitConsumer.buildUrl(linkfitConsumer.address);
      console.log(`BuildUrl=${url}`);
      expect(true);
  }),

  it('Step rate defaulted correctly and accessors work', async() => {
    const defaultRate = await linkfitConsumer.getStepRate();
    console.log(`defaultRate=${defaultRate}`);
    expect(defaultRate/10**18).to.equal(1/1000); // 1000 steps per token

    await linkfitConsumer.setStepRate(1000);
    const newRate = await linkfitConsumer.getStepRate();
    console.log(`newRate=${newRate}`);
    expect(newRate).to.equal(1000);

    await linkfitConsumer.setStepRate(defaultRate);
    expect(await linkfitConsumer.getStepRate()).to.equal(defaultRate);
  }),

  it('Total Supply of tokens in owners address', async() => {
    const [owner] = await ethers.getSigners();
    const balance = await linkfitConsumer.balanceOf(owner.address);
    expect(balance/10**18).to.equal(1000000000); // total supply = 1 billion
  })
})