import { ethers } from 'ethers';

/**
 * State for Metamask Wallet
 */
type MetamaskState = {
    accounts: string[];
    isConnected: boolean;
};

/**
 * Signer for Metamask Wallet
 */
type MetamaskSigner = ethers.providers.JsonRpcSigner;

/**
 * Metamask Assets
 */
type MetamaskAsset = unknown;

/**
 * Config for Metamask initialization
 */
type MetamaskChainConfig = {
    chainName: string;
    chainId: string; // does not follow ChainID
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};

export type { MetamaskState, MetamaskSigner, MetamaskAsset, MetamaskChainConfig };
