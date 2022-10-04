import { WALLET_TYPE } from '../config';
import { MyAlgo, MyAlgoTransaction } from './myalgo';
import { MyAlgoSigner, MyAlgoState } from './myalgo/types';
import { PeraWallet, PeraWalletTransaction } from './perawallet';
import { PeraWalletSigner, PeraWalletState } from './perawallet/types';
import {
    AlgorandWalletConnectSigner,
    AlgorandWalletConnectState,
    AlgorandWalletConnectTransaction,
    WalletConnect
} from './walletconnect';

/**
 * Generic interface for low level wallets
 */
type AlgorandWallet = MyAlgo | WalletConnect | PeraWallet;

/**
 * wallet enum to be used as identifier
 */
type AlgorandWalletType =
    | WALLET_TYPE.ALGORAND_MYALGO
    | WALLET_TYPE.ALGORAND_PERAWALLET
    | WALLET_TYPE.ALGORAND_WALLETCONNECT;

// TECH DEBT: needs to be removed
type AlgorandSignerTxn = MyAlgoTransaction | AlgorandWalletConnectTransaction | PeraWalletTransaction;

/**
 * Signer object passed
 */
type AlgorandSigner = MyAlgoSigner | AlgorandWalletConnectSigner | PeraWalletSigner;

/**
 * Internal state of the wallet to be passed using the @see toJSON
 */
type AlgorandState = {
    myAlgo?: MyAlgoState;
    walletConnect?: AlgorandWalletConnectState;
    peraWallet?: PeraWalletState;
};

/**
 * Config used to initialize chain wallet
 */
type AlgorandConfig = {
    hookType: 'all' | 'active' | 'disable';
    defaultWallet: AlgorandWalletType;
};

export { AlgorandWallet };
export type { AlgorandWalletType, AlgorandConfig, AlgorandSigner, AlgorandSignerTxn, AlgorandState };
