import { ethers } from "ethers";

type MetamaskState = {
  accounts: string[];
  isConnected: boolean;
};

type MetamaskSigner = ethers.providers.JsonRpcSigner;

type MetamaskAsset = {};

type MetamaskChainConfig = {
  chainName: string;
  chainId: string; // does not follow ChainID
  nativeCurrency: {
    name: string;
    decimals: 18;
    symbol: string;
  };
  rpcUrls: string[];
};

export type {
  MetamaskState,
  MetamaskSigner,
  MetamaskAsset,
  MetamaskChainConfig,
};
