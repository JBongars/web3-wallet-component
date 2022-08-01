import { Signer as RootSigner } from "~/src/types";
import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/abstract-provider";

type MetamaskState = {
  accounts: string[];
  isConnected: boolean;
};

type ProviderMessage = {
  type: string;
  data: unknown;
};

type MetamaskSigner = RootSigner<TransactionRequest, TransactionResponse>;

type MetamaskAsset = {};

export type { MetamaskState, ProviderMessage, MetamaskSigner, MetamaskAsset };
