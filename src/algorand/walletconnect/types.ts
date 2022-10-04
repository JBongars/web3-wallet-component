import { SignedTx } from '@randlabs/myalgo-connect';
import { Signer as RootSigner } from '~/src/types';
import { AlgorandSignerTxn } from '../types';

type AlgorandWalletConnectState = {
    accounts: string[];
    isConnected: boolean;
};

type AlgorandWalletConnectSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

type AlgorandWalletConnectTransaction = Uint8Array[];

type AlgorandWalletConnectAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};

export type {
    AlgorandWalletConnectState,
    AlgorandWalletConnectSigner,
    AlgorandWalletConnectTransaction,
    AlgorandWalletConnectAsset
};
