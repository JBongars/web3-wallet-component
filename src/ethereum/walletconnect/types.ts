import { Signer as RootSigner } from '~/src/types';
import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

/**
 * State for EthereumWalletConnect Wallet
 */
type EthereumWalletConnectState = {
    accounts: string[];
    isConnected: boolean;
};

/**
 * Signer for EthereumWalletConnect Wallet
 */
type EthereumWalletConnectSigner = RootSigner<TransactionRequest, TransactionResponse>;

/**
 * EthereumWalletConnect Assets
 */
type EthereumWalletConnectAsset = {};

/**
 * Config for EthereumWalletConnect initialization
 */
type EthereumWalletConnectChainConfig = {
    chainName: string;
    chainId: string; // does not follow ChainID
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};

export type {
    EthereumWalletConnectState,
    EthereumWalletConnectSigner,
    EthereumWalletConnectAsset,
    EthereumWalletConnectChainConfig
};
