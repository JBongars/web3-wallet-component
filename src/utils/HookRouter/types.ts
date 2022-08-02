enum WALLET_STATUS {
  OK,
  LOGIN_ERROR,
  WALLET_ERROR,
  EXTENSION_NOT_FOUND,
  ACCOUNT_NOT_FOUND,
}

enum WALLET_HOOK {
  ACCOUNT_ON_CHANGE,
  CHAIN_ON_CHANGE,
  DISCONNECT,
  NEW_BLOCK,
}

type HookEvent = {
  destroy: () => void;
  id: Symbol;
};

export { WALLET_HOOK, WALLET_STATUS };
export type { HookEvent };
