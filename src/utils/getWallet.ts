import WalletConnect from '@walletconnect/client';
import { Algorand, MyAlgo, PeraWallet } from '../algorand';
import { CHAIN_TYPE, WALLET_TYPE } from '../config';
import { Ethereum, EthWalletConnect, Metamask } from '../ethereum';

const getChainWallet = (chainId: CHAIN_TYPE) => {
    switch (chainId) {
        case CHAIN_TYPE.ALGORAND:
            return Algorand;
        case CHAIN_TYPE.ETHEREUM:
            return Ethereum;
        default:
            throw new Error(`Chain ID not found: ${chainId}`);
    }
};

const getModularWallet = (walletId: WALLET_TYPE) => {
    switch (walletId) {
        case WALLET_TYPE.ALGORAND_MYALGO:
            return MyAlgo;
        case WALLET_TYPE.ALGORAND_PERAWALLET:
            return PeraWallet;
        case WALLET_TYPE.ALGORAND_WALLETCONNECT:
            return WalletConnect;
        case WALLET_TYPE.ETHEREUM_METAMASK:
            return Metamask;
        case WALLET_TYPE.ETHEREUM_WALLETCONNECT:
            return EthWalletConnect;
        default:
            throw new Error(`Wallet ID not found: ${walletId}`);
    }
};

const getWallet = (id: number, isChain: boolean) => {
    if (isChain) {
        return getChainWallet(id);
    }
    return getModularWallet(id);
};

export { getChainWallet, getModularWallet, getWallet };
