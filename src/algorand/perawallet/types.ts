import { SignedTx } from '@randlabs/myalgo-connect';
import { Signer as RootSigner } from '~/src/types';
import { AlgorandSignerTxn } from '../Algorand';

type Accounts = {
    address: string;
    name: string;
};

type PeraWalletState = {
    accounts: Accounts[];
    isConnected: boolean;
};

type PeraWalletSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

type PeraWalletAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};

export type { PeraWalletState, PeraWalletSigner, PeraWalletAsset };
