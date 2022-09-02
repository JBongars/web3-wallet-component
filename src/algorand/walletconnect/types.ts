import { AlgorandTxn, SignedTx } from "@randlabs/myalgo-connect";
import { Signer as RootSigner } from "~/src/types";

type WalletConnectState = {
  accounts: string[];
  isConnected: boolean;
};

type WalletConnectSigner = RootSigner<AlgorandTxn, SignedTx>;

type WalletConnectAsset = {
  chainId: String;
  name: String;
  unit_name: String;
  id: String;
  sourceDecimals: Number;
};

export type { WalletConnectState, WalletConnectSigner, WalletConnectAsset };
