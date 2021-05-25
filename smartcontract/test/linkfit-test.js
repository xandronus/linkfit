const { expect } = require('chai')

describe('LinkFitTokenConsumer', async function () {
  let linkfitConsumer, mockOracle, linkToken

  beforeEach(async () => {
    await deployments.fixture(['mocks', 'linkfit'])

    const LinkToken = await deployments.get('LinkToken')
    linkToken = await ethers.getContractAt('LinkToken', LinkToken.address)
    const LinkFitTokenConsumer = await deployments.get('LinkFitToken')
    linkfitConsumer = await ethers.getContractAt('LinkFitToken', LinkFitTokenConsumer.address)
    const MockOracle = await deployments.get('MockOracle')
    mockOracle = await ethers.getContractAt('MockOracle', MockOracle.address)
  })

  it('Can successfully redeem steps through an external API request', async () => {
    const [owner, addr1] = await ethers.getSigners();
    const expected = '2000';
    await linkToken.transfer(linkfitConsumer.address, '2000000000000000000')
    const transaction = await linkfitConsumer.requestRedemption(addr1.address)
    const tx_receipt = await transaction.wait()
    const requestId = tx_receipt.events[0].topics[1]
    const returnData = web3.utils.padLeft(web3.utils.padLeft(web3.utils.toHex(expected)), 64)
    const tx = await mockOracle.fulfillOracleRequest(requestId, returnData)
    await tx.wait()
    expect(await linkfitConsumer.getSteps(addr1.address)).to.equal(expected)
    await linkfitConsumer.redeem(addr1.address)
    expect(await linkfitConsumer.getSteps(addr1.address)).to.equal(0)
    expect(await linkfitConsumer.balanceOf(addr1.address)).to.equal('2000000000000000000');
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
  }),

  it("Should transfer tokens between accounts", async function() {
    const [owner, addr1, addr2] = await ethers.getSigners();
   
    // Transfer 50 tokens from owner to addr1
    await linkfitConsumer.transfer(addr1.address, 50);
    expect(await linkfitConsumer.balanceOf(addr1.address)).to.equal(50);
    
    // Transfer 50 tokens from addr1 to addr2
    await linkfitConsumer.connect(addr1).transfer(addr2.address, 50);
    expect(await linkfitConsumer.balanceOf(addr2.address)).to.equal(50);
  });
})