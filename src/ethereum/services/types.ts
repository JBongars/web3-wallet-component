import { ethers } from 'ethers';
import { WALLET_TYPE } from '../../config';

/**
 * Config for Ethereum Chain
 */
type EthereumChainConfig = {
    chainName: string;
    chainId: string; // does not follow ChainID
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};

type Provider = ethers.providers.Web3Provider;

type WindowEthereumMappedKey = 'MetaMask' | 'CoinbaseWallet';

type EthereumObject = ethers.providers.ExternalProvider;

export type { EthereumChainConfig, Provider, WindowEthereumMappedKey, EthereumObject };
