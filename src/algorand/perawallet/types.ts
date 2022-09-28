import { SignedTx } from "@randlabs/myalgo-connect";
import { Signer as RootSigner } from "~/src/types";
import { AlgorandSignerTxn } from "../Algorand";

type Accounts = {
  address: string;
  name: string;
}

type PeraWalletState = {
  accounts: Accounts[];
  isConnected: boolean;
};

type PeraWalletSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

type PeraWalletAsset = {
  chainId: String;
  name: String;
  unit_name: String;
  id: String;
  sourceDecimals: Number;
};

export type { PeraWalletState, PeraWalletSigner, PeraWalletAsset };
