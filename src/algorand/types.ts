import { WALLET_TYPE } from '../config';
import { MyAlgo, MyAlgoTransaction } from './myalgo';
import { MyAlgoSigner, MyAlgoState } from './myalgo/types';
import { PeraWallet, PeraWalletTransaction } from './perawallet';
import { PeraWalletSigner, PeraWalletState } from './perawallet/types';
import { WalletConnectTransaction, WalletConnect } from './walletconnect';
import { WalletConnectSigner, WalletConnectState } from './walletconnect/types';

type AlgorandWallet = MyAlgo | WalletConnect | PeraWallet;
type AlgorandWalletType =
    | WALLET_TYPE.ALGORAND_MYALGO
    | WALLET_TYPE.ALGORAND_PERAWALLET
    | WALLET_TYPE.ALGORAND_WALLETCONNECT;

// TECH DEBT: needs to be removed
type AlgorandSignerTxn = MyAlgoTransaction | WalletConnectTransaction | PeraWalletTransaction;

type AlgorandSigner = MyAlgoSigner | WalletConnectSigner | PeraWalletSigner;

type AlgorandState = {
    myAlgo?: MyAlgoState;
    walletConnect?: WalletConnectState;
    peraWallet?: PeraWalletState;
};

type AlgorandConfig = {
    hookType: 'all' | 'active' | 'disable';
    defaultWallet: AlgorandWalletType;
};

export { AlgorandWallet };
export type { AlgorandWalletType, AlgorandConfig, AlgorandSigner, AlgorandSignerTxn, AlgorandState };
