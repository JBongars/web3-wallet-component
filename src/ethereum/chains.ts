import axios from "axios";
import { ethers } from "ethers";

type ChainConfig = {
    chainName: string;
    chainId: string;
    nativeCurrency: {
        name: string;
        decimals: number;
        symbol: string;
    };
    rpcUrls: string[];
};

const mainnetEth: ChainConfig = {
    chainName: 'Ethereum Mainnet',
    chainId: '0x1',
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    rpcUrls: ['https://rinkeby.etherscan.io']
};

const ropstenEth: ChainConfig = {
    chainName: 'Ropsten Test Network',
    chainId: '0x3',
    nativeCurrency: { name: 'RopstenETH', decimals: 18, symbol: 'RopstenETH' },
    rpcUrls: ['https://ropsten.etherscan.io']
};

const rinkebyEth: ChainConfig = {
    chainName: 'Rinkeby Test Network',
    chainId: '0x4',
    nativeCurrency: { name: 'RinkebyETH', decimals: 18, symbol: 'RinkebyETH' },
    rpcUrls: ['https://rinkeby.etherscan.io']
};

const goerliEth: ChainConfig = {
    chainName: 'Goerli Test Network',
    chainId: '0x5',
    nativeCurrency: { name: 'GoerliETH', decimals: 18, symbol: 'GoerliETH' },
    rpcUrls: ['https://goerli.etherscan.io']
};

const kovanEth: ChainConfig = {
    chainName: 'Kovan Test Network',
    chainId: '0x2a',
    nativeCurrency: { name: 'KovanETH', decimals: 18, symbol: 'KovanETH' },
    rpcUrls: ['https://kovan.etherscan.io']
};

const sepoliaEth: ChainConfig = {
    chainName: 'Sepolia Test Network',
    chainId: '0xaa36a7',
    nativeCurrency: { name: 'SepoliaETH', decimals: 18, symbol: 'SepoliaETH' },
    rpcUrls: ['https://sepolia.etherscan.io']
};

const getChainConfig = async (chainId: number): Promise<ChainConfig> => {
    const { data } = await axios.get('https://chainid.network/chains.json');
    const item = data.find((datum: any) => datum.networkId === chainId);
    switch (chainId) {
        case 1:
            return mainnetEth;
        case 3:
            return ropstenEth;
        case 4:
            return rinkebyEth;
        case 5:
            return goerliEth;
        case 42:
            return kovanEth;
        case 11155111:
            return sepoliaEth;
        default:
            return {
                chainName: item.title,
                chainId: ethers.utils.hexlify(item.networkId),
                nativeCurrency: item.nativeCurrency,
                rpcUrls: item.rpc
            };

        // throw new Error(`ChainId ${chainId} configuration not found`);
    }
};

export { rinkebyEth, mainnetEth, getChainConfig };
