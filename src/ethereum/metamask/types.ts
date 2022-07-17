import {ethers} from "ethers";

type State = {
  accounts: string[],
  isConnected: Boolean
};

type Asset = {};

export type { State as MetaMaskState, Asset };
