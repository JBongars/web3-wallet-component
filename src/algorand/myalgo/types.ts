import { Accounts } from '@randlabs/myalgo-connect'

type State = {
  accounts: Accounts[],
  isConnected: Boolean,
};

type Asset = {
  chainId: String,
  name: String,
  unit_name: String,
  id: String,
  sourceDecimals: Number
};

export type { State as MyAlgoState, Asset };
