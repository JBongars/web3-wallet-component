import { SignedTx } from '@randlabs/myalgo-connect';
import { Signer as RootSigner } from '~/src/types';
import { AlgorandSignerTxn } from '../types';

type WalletConnectState = {
    accounts: string[];
    isConnected: boolean;
};

type WalletConnectSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

type WalletConnectAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};

export type { WalletConnectState, WalletConnectSigner, WalletConnectAsset };
