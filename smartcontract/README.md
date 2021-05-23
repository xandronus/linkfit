<br/>
<p align="center">
<a href="https://chain.link" target="_blank">
<img src="https://raw.githubusercontent.com/smartcontractkit/chainlink-hardhat-box/master/box-img-lg.png" width="225" alt="Chainlink Hardhat logo">
</a>
</p>
<br/>

# LinkFitToken Contract
 
 Rinkeby
 0xa413b2c82ae4C0E4879CAb947f035538f20e835B

 Kovan
 0xd89921566A395ceB9dB77D2710FDbaDCdbcc12dA

 ## Requirements

- [NPM](https://www.npmjs.com/) or [YARN](https://yarnpkg.com/)

## Installation

Set your `KOVAN_RPC_URL` [environment variable.](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). You can get one for free at [Infura's site.](https://infura.io/). You'll also need to set the variable `PRIVATE_KEY` which is your private key from you wallet, ie metamask. 

You can set this in your `.env` file if you're unfamiliar with how setting environment variables work. 

`.env` example:
```
KOVAN_RPC_URL='www.infura.io/asdfadsfafdadf'
PRIVATE_KEY='abcdef'
MAINNET_RPC_URL="https://eth-mainnet.alchemyapi.io/v2/your-api-key"
```
`bash` example
```
export KOVAN_RPC_URL='www.infura.io/asdfadsfafdadf'
export MNEMONIC='cat dog frog...'
export MAINNET_RPC_URL="https://eth-mainnet.alchemyapi.io/v2/your-api-key"
```

If you plan on deploying to a local [Hardhat network](https://hardhat.org/hardhat-network/) that's a fork of the Ethereum mainnet instead of a public test network like Kovan, you'll also need to set your `MAINNET_RPC_URL` [environment variable.](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html) and uncomment the `forking` section in `hardhat.config.js`. You can get one for free at [Alchemy's site.](https://alchemyapi.io/). 

You can also use a `PRIVATE_KEY` instead of a `MNEMONIC` environment variable by uncommenting the section in the `hardhat.config.js`, and commenting out the `MNEMONIC` line. 

Then you can install all the dependencies

```bash
git clone https://github.com/smartcontractkit/chainlink-hardhat-box
cd chainlink-hardhat-box
```
then

```bash
npm install
```

Or

```bash
yarn
```

## Deploy

Deployment scripts are in the [deploy](https://github.com/pappas999/chainlink-hardhat-box/tree/main/deploy) directory. If required, edit the desired environment specific variables or constructor parameters in each script, then run the hardhat deployment plugin as follows. If no network is specified, it will default to the Kovan network.

This will deploy to a local hardhat network

```bash
npx hardhat deploy 
```

To deploy to testnet:
```bash
npx hardhat deploy --network kovan
```

## Test
Tests are located in the [test](https://github.com/pappas999/chainlink-hardhat-box/tree/main/test) directory and can be modified as required. To run them:

```bash
npx hardhat test
```

## Run

The deployment output will give you the contract addresses as they are deployed. You can then use these contract addresses in conjunction with Hardhat tasks to perform operations on each contract


### Tasks

```bash
npx hardhat fund-link --contract insert-contract-address-here --network network
```

```bash
npx hardhat request-redemption --contract insert-contract-address-here --recipient insert-receipient-address-here --network network
```

### Request & Receive Data

## Verify on Etherscan

You'll need an `ETHERSCAN_API_KEY` environment variable. You can get one from the [Etherscan API site.](https://etherscan.io/apis)

```
npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
```
example:

```
npx hardhat verify --network kovan 0x9279791897f112a41FfDa267ff7DbBC46b96c296 "0x9326BFA02ADD2366b30bacB125260Af641031331"
```

### Linting

```
yarn lint:fix
```
