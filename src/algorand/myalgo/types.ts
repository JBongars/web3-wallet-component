import { Accounts, SignedTx } from "@randlabs/myalgo-connect";
import { Signer as RootSigner } from "~/src/types";
import { AlgorandSignerTxn } from "../Algorand";

type MyAlgoState = {
  accounts: Accounts[];
  isConnected: boolean;
};

type MyAlgoSigner = RootSigner<AlgorandSignerTxn, SignedTx>;

type MyAlgoAsset = {
  chainId: String;
  name: String;
  unit_name: String;
  id: String;
  sourceDecimals: Number;
};

export type { MyAlgoState, MyAlgoSigner, MyAlgoAsset };
