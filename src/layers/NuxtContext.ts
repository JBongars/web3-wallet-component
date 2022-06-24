import { Signer, WalletStore, WALLET_STATUS } from "..";

type StoreRequestDTO<T> = {
  chain: keyof WalletStore;
  wallet: keyof WalletStore[keyof WalletStore];
  property: string;
  data: T;
};

const walletStore = new WalletStore();

const state = () => ({
  walletStore,
});

const actions = {
  use: async (
    context: any,
    request: StoreRequestDTO<unknown[]>
  ): Promise<any> => {
    const action = walletStore[request.chain][request.wallet][
      request.property
    ] as Function;
    return action(...request.data);
  },

  init: async (
    context: any,
    request: StoreRequestDTO<undefined>
  ): Promise<WALLET_STATUS> => {
    return context.walletStore[request.chain][request.wallet].init(
      request.data
    );
  },

  signIn: async (
    context: any,
    request: StoreRequestDTO<undefined>
  ): Promise<WALLET_STATUS> => {
    return context.walletStore[request.chain][request.wallet].signIn(
      request.data
    );
  },

  signOut: async (
    context: any,
    request: StoreRequestDTO<undefined>
  ): Promise<WALLET_STATUS> => {
    return context.walletStore[request.chain][request.wallet].signOut(
      request.data
    );
  },

  getSigner: (context: any, request: StoreRequestDTO<undefined>): Signer => {
    return context.walletStore[request.chain][request.wallet].getSigner(
      request.data
    );
  },

  getAmount: async (
    context: any,
    request: StoreRequestDTO<undefined>
  ): Promise<number> => {
    return context.walletStore[request.chain][request.wallet].getAmount(
      request.data
    );
  },

  getAsset: async (
    context: any,
    request: StoreRequestDTO<undefined>
  ): Promise<unknown> => {
    return context.walletStore[request.chain][request.wallet].getAsset(
      request.data
    );
  },
};

export { state, actions };
export type { StoreRequestDTO as WalletStoreRequestDTO };
