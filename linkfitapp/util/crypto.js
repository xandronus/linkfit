import { ethers } from "ethers";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}  

export async function getEthBalance(ensAddr) {
    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NET, process.env.ALCHEMY_KEY);
    console.log(`  Addr: ${ensAddr} => ${await provider.resolveName(ensAddr)}`);
    return ethers.utils.formatEther(await provider.getBalance(ensAddr));
}

export async function getTokenBalance(ensAddr) {
    // TODO: for now stub out using eth call
    return getEthBalance(ensAddr);
    /*    
    const tokenAddress = '0xAEFS...'; // insert TRON token contract address here
    const getBalance = async (options) => {
      const contract = new Contract(tokenAddress, abi, options.provider);
      const balance = await contract.balanceOf(options.address);
      return balance.toString();
    };
    */
}

