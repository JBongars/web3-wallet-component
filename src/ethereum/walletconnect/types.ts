import { Signer as RootSigner } from '~/src/types';
import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

/**
 * State for WalletConnect Wallet
 */
type WalletConnectState = {
    accounts: string[];
    isConnected: boolean;
};

/**
 * Signer for WalletConnect Wallet
 */
type WalletConnectSigner = RootSigner<TransactionRequest, TransactionResponse>;

/**
 * WalletConnect Assets
 */
type WalletConnectAsset = {};

/**
 * Config for WalletConnect initialization
 */
type WalletConnectChainConfig = {
    chainName: string;
    chainId: string; // does not follow ChainID
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};

export type { WalletConnectState, WalletConnectSigner, WalletConnectAsset, WalletConnectChainConfig };
