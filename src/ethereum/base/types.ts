import { ethers } from 'ethers';

/**
 * State for BaseEthereum Wallet
 */
type BaseEthereumState = {
    accounts: string[];
    isConnected: boolean;
};

/**
 * Signer for BaseEthereum Wallet
 */
type BaseEthereumSigner = ethers.providers.JsonRpcSigner;

/**
 * BaseEthereum Assets
 */
type BaseEthereumAsset = unknown;

/**
 * Config for BaseEthereum initialization
 */
type BaseEthereumChainConfig = {
    chainName: string;
    chainId: string; // does not follow ChainID
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};

export type { BaseEthereumState, BaseEthereumSigner, BaseEthereumAsset, BaseEthereumChainConfig };
