import { Accounts, SignedTx } from '@randlabs/myalgo-connect';
import { Signer as RootSigner } from '~/src/types';
import { AlgorandSignerTxn } from '../Algorand';

type MyAlgoState = {
    accounts: Accounts[];
    isConnected: boolean;
};

type MyAlgoSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

type MyAlgoAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};

export type { MyAlgoState, MyAlgoSigner, MyAlgoAsset };
