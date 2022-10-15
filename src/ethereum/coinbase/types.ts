import { CoinbaseWalletSDKOptions } from '@coinbase/wallet-sdk/dist/CoinbaseWalletSDK';
import { ethers } from 'ethers';

/**
 * State for Coinbase Wallet
 */
type CoinbaseState = {
    accounts: string[];
    isConnected: boolean;
};

/**
 * Signer for Coinbase Wallet
 */
type CoinbaseSigner = ethers.providers.JsonRpcSigner;

/**
 * Coinbase Assets
 */
type CoinbaseAsset = unknown;

/**
 * Coinbase Requires some initial variables in order to work
 */
type CoinbaseConfig = {
    coinbaseConfig: CoinbaseWalletSDKOptions;
    defaultEthJsonRPCUrl: string;
    defaultChainId: number;
};

/**
 * Config for Coinbase initialization
 */
type CoinbaseChainConfig = {
    chainName: string;
    chainId: string; // does not follow ChainID
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};

export type { CoinbaseState, CoinbaseConfig, CoinbaseSigner, CoinbaseAsset, CoinbaseChainConfig };
