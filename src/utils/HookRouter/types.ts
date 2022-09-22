enum WALLET_STATUS {
  OK,
  LOGIN_ERROR,
  WALLET_ERROR,
  EXTENSION_NOT_FOUND,
  ACCOUNT_NOT_FOUND,
}

enum WALLET_ID {
  ETHEREUM_METAMASK = 1,
  ALGORAND_MYALGO = 2,
  ALGORAND_WALLETCONNECT = 3,
  ETHEREUM_WALLETCONNECT = 4
}

enum WALLET_HOOK {
  CHAIN_ON_CHANGE,
  CHAIN_ON_DISCONNECT,
  ACCOUNT_ON_CHANGE,
  ACCOUNT_ON_DISCONNECT,
  NEW_BLOCK,
  CONNECT,
}

type HookEvent = {
  destroy: () => void;
  id: Symbol;
};

export { WALLET_HOOK, WALLET_STATUS, WALLET_ID };
export type { HookEvent };
