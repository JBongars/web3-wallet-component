import { Signer as RootSigner } from '~/src/types';
import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

type WalletConnectState = {
    accounts: string[];
    isConnected: boolean;
};

type WalletConnectSigner = RootSigner<TransactionRequest, TransactionResponse>;

type WalletConnectAsset = {};

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
