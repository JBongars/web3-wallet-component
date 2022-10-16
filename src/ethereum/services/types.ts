import { ethers } from 'ethers';
import { EthereumEvent } from './ethereumEvents';

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

// type EthereumRequest = {}; // https://docs.walletconnect.com/json-rpc-api-methods/ethereum

type EthereumObject = ethers.providers.ExternalProvider & {
    providerMap: Map<string, EthereumObject>;
    provider: EthereumObject[];
    networkVersion: string;
    isCoinbaseWallet?: boolean;
    isMetaMask?: boolean;
    on: EthereumEvent;
};

export type { EthereumChainConfig, Provider, WindowEthereumMappedKey, EthereumObject };
