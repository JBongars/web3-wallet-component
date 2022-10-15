import { utils } from 'ethers';
import { AlgorandWallet, CHAIN_TYPE, EthereumWallet, Wallet } from '../../../src';

const makeAlgorandTransaction = async (wallet: AlgorandWallet) => {
    return '';
};

const makeEthereumTransaction = async (wallet: EthereumWallet) => {
    const testContractAddress: string = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
    const tx = {
        to: testContractAddress,
        value: utils.parseEther('0.05')
    };
    const signer = await wallet.getSigner();
    const transactionResponse = await signer.sendTransaction(tx);

    return transactionResponse.hash;
};

const makeTransaction = async (blockchainId: CHAIN_TYPE, wallet: Wallet) => {
    switch (blockchainId) {
        case CHAIN_TYPE.ALGORAND:
            return makeAlgorandTransaction(wallet as AlgorandWallet);
        case CHAIN_TYPE.ETHEREUM:
            return makeEthereumTransaction(wallet as EthereumWallet);
    }
};

export { makeAlgorandTransaction, makeEthereumTransaction, makeTransaction };
