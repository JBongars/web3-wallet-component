enum WALLET_STATUS {
  OK,
  LOGIN_ERROR,
  WALLET_ERROR,
  EXTENSION_NOT_FOUND,
  ACCOUNT_NOT_FOUND,
}

enum WALLET_HOOK {
  CHAIN_ON_CHANGE,
  CHAIN_ON_DISCONNECT,
  ACCOUNT_ON_CHANGE,
  ACCOUNT_ON_DISCONNECT,
  NEW_BLOCK,
}

type HookEvent = {
  destroy: () => void;
  id: Symbol;
};

export { WALLET_HOOK, WALLET_STATUS };
export type { HookEvent };
