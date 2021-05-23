import { ethers } from "ethers";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}  

export async function getEthBalance(address) {
    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
    return ethers.utils.formatEther(await provider.getBalance(address));
}

export async function getTokenBalance(address) {
    // TODO: for now stub out using eth call
    return getEthBalance(address);
    /*    
    const tokenAddress = '0xAEFS...'; // insert TRON token contract address here
    const getBalance = async (options) => {
      const contract = new Contract(tokenAddress, abi, options.provider);
      const balance = await contract.balanceOf(options.address);
      return balance.toString();
    };
    */
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