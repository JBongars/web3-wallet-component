import { WALLET_TYPE } from '../config';
import { Metamask } from './metamask';
import { MetamaskSigner, MetamaskState } from './metamask/types';
import { EthWalletConnect } from './walletconnect';
import { WalletConnectState } from './walletconnect/types';

type EthereumWallet = Metamask | EthWalletConnect;

type EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK | WALLET_TYPE.ETHEREUM_WALLETCONNECT;

type EthereumSigner = MetamaskSigner;

type EthereumState = {
    metaMask?: MetamaskState;
    walletConnect?: WalletConnectState;
    activeWallets: EthereumWalletType[];
};

type EthereumConfig = {
    hookType: 'all' | 'active' | 'disable';
    defaultWallet: EthereumWalletType;
};

export type { EthereumWalletType, EthereumConfig, EthereumSigner, EthereumState, EthereumWallet };
