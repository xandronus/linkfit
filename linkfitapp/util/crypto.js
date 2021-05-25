import { ethers } from "ethers";
import TokenAbi from './LinkFitToken.json';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}  

export async function getEthBalance(address) {
    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
    return ethers.utils.formatEther(await provider.getBalance(address));
}

export async function getTokenBalance(address) {
    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
    const contract = new ethers.Contract(TokenAbi.address, TokenAbi.abi, provider);
    return ethers.utils.formatEther(await contract.balanceOf(address));    
}

export async function transferSteps(address) {
    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    let contract = new ethers.Contract(TokenAbi.address, TokenAbi.abi, wallet);
    await contract.requestRedemption(address);
}

export async function getSteps(address) {
    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
    const contract = new ethers.Contract(TokenAbi.address, TokenAbi.abi, provider);
    const steps = await contract.getSteps(address);
    return steps.toNumber();    
}

export async function redeemTokens(address) {
    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    let contract = new ethers.Contract(TokenAbi.address, TokenAbi.abi, wallet);

    if (await contract.getSteps(address).toNumber() !== 0) {
        await contract.redeem(address);
        return true;
    }

    return false;
}

export async function getStepRate() {
    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    let contract = new ethers.Contract(TokenAbi.address, TokenAbi.abi, wallet);
    const stepRate = ethers.utils.formatEther(await contract.getStepRate());
    return stepRate;
}

// Normalizes crypto addresses to hex CheckSum addresses - which are used for keys in the database
// Supports converting with ENS if address doesn't look like a hex address
export async function normalizeAddress(address) {
    var hexAddr = null;
    if (ethers.utils.isAddress(address)) {
        hexAddr = ethers.utils.getAddress(address);
    }
    else {
        const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
        hexAddr = await provider.resolveName(address);
    }

    return hexAddr;
}