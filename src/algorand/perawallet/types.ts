import { SignedTx } from '@randlabs/myalgo-connect';
import { Signer as RootSigner } from '~/src/types';
import { AlgorandSignerTxn } from '../types';

/**
 * Account information. This object is returned when fetching the primary account
 */
type Accounts = {
    address: string;
    name: string;
};

/**
 * State for Pera Wallet
 */
type PeraWalletState = {
    accounts: Accounts[];
    isConnected: boolean;
};

/**
 * Signer for Pera Wallet
 */
type PeraWalletSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

/**
 * Pera Assets
 */
type PeraWalletAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};

export type { PeraWalletState, PeraWalletSigner, PeraWalletAsset };
