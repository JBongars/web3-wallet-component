import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Algorand } from '../../src';
import { Ethereum } from '../../src/ethereum/Ethereum';

import WalletChainDemo from './WalletChainDemo';

const getWallet = (factory: () => any) => {
    const wallet = factory();
    wallet.init();

    return wallet;
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const walletDemo = {
    title: 'Wallet Chain Demo',
    component: WalletChainDemo
} as ComponentMeta<typeof WalletChainDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WalletChainDemo> = (args) => <WalletChainDemo {...args} />;

const ethereum = getWallet(() => new Ethereum({}));
const EthereumDemo = Template.bind({});
EthereumDemo.args = {
    wallet: ethereum
};

const algorand = getWallet(() => new Algorand({}));
const AlgorandDemo = Template.bind({});
AlgorandDemo.args = {
    wallet: algorand
};
export { EthereumDemo, AlgorandDemo };
export default walletDemo;
