import { Accounts, SignedTx } from '@randlabs/myalgo-connect';
import { Signer as RootSigner } from '~/src/types';
import { AlgorandSignerTxn } from '../types';

/**
 * State for Myalgo Wallet
 */
type MyAlgoState = {
    accounts: Accounts[];
    isConnected: boolean;
};

/**
 * Signer for Myalgo Wallet
 */
type MyAlgoSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

/**
 * Myalgo Assets
 */
type MyAlgoAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};

export type { MyAlgoState, MyAlgoSigner, MyAlgoAsset };
