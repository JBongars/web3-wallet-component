import { WALLET_TYPE } from '../config';
import { Metamask } from './metamask';
import { MetamaskSigner, MetamaskState } from './metamask/types';
import { EthereumWalletConnectState, EthWalletConnect } from './walletconnect';

/**
 * Generic interface for low level wallets
 */
type EthereumWallet = Metamask | EthWalletConnect;

/**
 * wallet enum to be used as identifier
 */
type EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK | WALLET_TYPE.ETHEREUM_WALLETCONNECT;

/**
 * Signer object passed
 */
type EthereumSigner = MetamaskSigner;

/**
 * Internal state of the wallet to be passed using the @see toJSON
 */
type EthereumState = {
    metaMask?: MetamaskState;
    walletConnect?: EthereumWalletConnectState;
    activeWallets: EthereumWalletType[];
};

/**
 * Config used to initialize chain wallet
 */
type EthereumConfig = {
    hookType: 'all' | 'active' | 'disable';
    defaultWallet: EthereumWalletType;
};

export type { EthereumWalletType, EthereumConfig, EthereumSigner, EthereumState, EthereumWallet };
