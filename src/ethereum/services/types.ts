import { ethers } from 'ethers';
import { ChainConfig } from '../../SuperWallet';
import web3 from 'web3';
import { provider } from 'web3-core';

/**
 * Config for Ethereum Chain
 */
type EthereumChainConfig = {
    chainName: string;
    chainId: string; // does not follow ChainID
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};

type Provider = ethers.providers.Web3Provider;

type EthereumObject = ethers.providers.ExternalProvider;

export type { EthereumChainConfig, Provider, EthereumObject };
