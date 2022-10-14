import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Algorand, Coinbase, EthWalletConnect, Metamask, MyAlgo, PeraWallet, WalletConnect } from '../../src';
import { Ethereum } from '../../src/ethereum/Ethereum';

import WalletDemo from './WalletDemo';

const getWallet = (factory: () => any) => {
    const wallet = factory();
    wallet.init();

    return wallet;
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const walletDemo = {
    title: 'Wallet Demo',
    component: WalletDemo
} as ComponentMeta<typeof WalletDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WalletDemo> = (args) => <WalletDemo {...args} />;

const ethereumMetamask = getWallet(() => new Metamask());
const EthereumMetamask = Template.bind({});
EthereumMetamask.args = {
    wallet: ethereumMetamask
};

const ethereumWalletConnect = getWallet(() => new EthWalletConnect());
const EthereumWalletConnect = Template.bind({});
EthereumWalletConnect.args = {
    wallet: ethereumWalletConnect
};

const ethereumCoinbase = getWallet(() => new Coinbase());
const EthereumCoinbase = Template.bind({});
EthereumCoinbase.args = {
    wallet: ethereumCoinbase
};

const myalgo = getWallet(() => new MyAlgo());
const AlgorandMyAlgo = Template.bind({});
AlgorandMyAlgo.args = {
    wallet: myalgo
};

const walletconnect = getWallet(() => new WalletConnect());
const AlgoWalletConnect = Template.bind({});
AlgoWalletConnect.args = {
    wallet: walletconnect
};

const peraWallet = getWallet(() => new PeraWallet());
const AlgoPera = Template.bind({});
AlgoPera.args = {
    wallet: peraWallet
};

export { EthereumMetamask, EthereumWalletConnect, EthereumCoinbase, AlgorandMyAlgo, AlgoWalletConnect, AlgoPera };
export default walletDemo;
