import { WalletInterface, ChainID } from "../../types";
import {
  MetamaskAsset,
  MetamaskChainConfig,
  MetamaskSigner,
  MetamaskState,
} from "./types";
import { ethers } from "ethers";
import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { useWindow } from "../../containers";
import {
  NotImplementedError,
  WalletNotConnectedError,
  WalletNotInstalledError,
} from "~/src/errors";
import HookRouter from "~/src/utils/HookRouter/HookRouter";
import { WALLET_HOOK, WALLET_STATUS } from "~/src/utils/HookRouter/types";
import { getChainConfig } from "./chains";

const initialState: Readonly<MetamaskState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class Metamask implements WalletInterface<MetamaskState> {
  private hookRouter: HookRouter = new HookRouter([
    WALLET_HOOK.ACCOUNT_ON_CHANGE,
    WALLET_HOOK.CHAIN_ON_CHANGE,
    WALLET_HOOK.DISCONNECT,
    WALLET_HOOK.NEW_BLOCK,
  ]);
  public state: MetamaskState;
  public provider?: ethers.providers.Web3Provider;

  constructor(state?: MetamaskState) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  private enforceIsConnected(): void {
    if (!this.getIsConnected()) {
      throw new WalletNotConnectedError();
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    this.provider = await this.getProvider();

    return WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const provider = await this.getProvider();
    this.state.accounts = await provider.send("eth_requestAccounts", []);
    this.state.isConnected = this.state.accounts.length > 0;

    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.enforceIsConnected();
    this.state.accounts = [];
    this.state.isConnected = false;

    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<MetamaskSigner> {
    return async (
      transactions: TransactionRequest[]
    ): Promise<TransactionResponse[]> => {
      this.enforceIsConnected();

      const provider = this.provider || (await this.getProvider());
      const transactionResponse = await provider
        .getSigner()
        .sendTransaction(transactions[0]);

      return [transactionResponse];
    };
  }

  public async getBalance(): Promise<string> {
    this.enforceIsConnected();

    const provider = this.provider || (await this.getProvider());
    const balance = await provider.getBalance(this.state.accounts[0]);
    return balance.toString();
  }

  public async getAssets(): Promise<MetamaskAsset[]> {
    throw new NotImplementedError();
  }

  public getIsConnected(): boolean {
    return this.state.isConnected;
  }

  public getIsWalletInstalled(): boolean {
    const ethereum = useWindow(
      async (windowObject) => (windowObject as any).ethereum
    ) as any;

    return ethereum !== null;
  }

  public getPrimaryAccount(): string {
    this.enforceIsConnected();

    return this.state.accounts[0];
  }

  public getAccounts(): string[] {
    this.enforceIsConnected();

    return this.state.accounts;
  }

  public async fetchCurrentChainID(): Promise<number> {
    this.enforceIsConnected();

    const provider: ethers.providers.Web3Provider = await this.getProvider();
    const chainId: number = await provider.send("eth_chainId", []);

    return chainId;
  }

  public async addChainToWallet(
    chainConfig: MetamaskChainConfig
  ): Promise<void> {
    return useWindow(async (window: any) =>
      window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [chainConfig],
      })
    );
  }

  public async forceCurrentChainID(chain: number): Promise<void> {
    const ethereum = useWindow((window: any) => window.ethereum);

    if (ethereum.networkVersion !== chain) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chain}` }],
        });
      } catch (err) {
        if (err && (err as { code: number }).code === 4902) {
          const chainConfig = getChainConfig(chain);
          await this.addChainToWallet(chainConfig);
        } else {
          throw err;
        }
      }
    }
  }

  public onAccountChange(cb: (accountId: string) => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_CHANGE,
      () => {
        return cb(this.getPrimaryAccount());
      }
    );
  }

  public onChainChange(cb: (chain: ChainID) => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.CHAIN_ON_CHANGE,
      async () => {
        const currentChainId: ChainID =
          (await this.fetchCurrentChainID()) as ChainID;
        return cb(currentChainId);
      }
    );
  }

  public onBlockAdded(cb: (newBlock: number) => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.NEW_BLOCK,
      (block: number) => {
        return cb(block);
      }
    );
  }

  public toJSON(): MetamaskState {
    return this.state;
  }

  public async mountEventListeners() {
    const provider = await this.getProvider();

    provider.on("accountsChanged", async (accounts: string[]) => {
      this.state.accounts = accounts;
      this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    });

    provider.on("chainChanged", async (_chainId: string) => {
      this.hookRouter.applyHooks([WALLET_HOOK.CHAIN_ON_CHANGE]);
    });

    provider.on("disconnect", async (result) => {
      this.signOut();
    });

    provider.on("block", (block: number) => {
      this.hookRouter.applyHookWithArgs(WALLET_HOOK.NEW_BLOCK, block);
    });
  }

  public async unmountEventListeners() {
    const provider = await this.getProvider();
    provider.removeAllListeners();
  }

  public async getProvider(): Promise<ethers.providers.Web3Provider> {
    const ethereum = (await useWindow(
      async (windowObject) => (windowObject as any).ethereum
    )) as any;

    if (ethereum === null) {
      throw new WalletNotInstalledError();
    }

    return new ethers.providers.Web3Provider(ethereum);
  }
}

export { Metamask };
