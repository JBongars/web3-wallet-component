import { Signer as RootSigner } from "~/src/types";
import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/abstract-provider";

type MetamaskState = {
  accounts: string[];
  isConnected: boolean;
};

type MetamaskSigner = RootSigner<TransactionRequest, TransactionResponse>;

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
