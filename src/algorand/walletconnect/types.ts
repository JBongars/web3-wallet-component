import { SignedTx } from "@randlabs/myalgo-connect";
import { Signer as RootSigner } from "~/src/types";
import { AlgorandSignerTxn } from "../Algorand";

type WalletConnectState = {
  accounts: string[];
  isConnected: boolean;
};

type WalletConnectSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

type WalletConnectAsset = {
  chainId: String;
  name: String;
  unit_name: String;
  id: String;
  sourceDecimals: Number;
};

export type { WalletConnectState, WalletConnectSigner, WalletConnectAsset };
