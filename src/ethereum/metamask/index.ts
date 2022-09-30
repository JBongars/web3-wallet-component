import { ethers } from "ethers";
import {
  NotImplementedError,
  WalletNotConnectedError,
  WalletNotInstalledError,
} from "~/src/errors";
import HookRouter from "~/src/utils/HookRouter/HookRouter";
import {
  WALLET_HOOK,
  WALLET_ID,
  WALLET_STATUS,
} from "~/src/utils/HookRouter/types";
import WalletStateStorage from "~/src/WalletStateStorage";
import { CHAIN_ETHEREUM, EthereumWalletType } from "..";
import { WALLET_TYPE } from "../../config/wallets";
import { useWindow } from "../../containers";
import { WalletInterface } from "../../types";
import { getChainConfig } from "./chains";
import { MetamaskAsset, MetamaskChainConfig, MetamaskState } from "./types";

const initialState: Readonly<MetamaskState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class Metamask implements WalletInterface<MetamaskState> {
  private hookRouter: HookRouter = new HookRouter([
    WALLET_HOOK.CHAIN_ON_CHANGE,
    WALLET_HOOK.CHAIN_ON_DISCONNECT,
    WALLET_HOOK.ACCOUNT_ON_CHANGE,
    WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
    WALLET_HOOK.NEW_BLOCK,
  ]);
  private chain: string | null = null;
  public state: MetamaskState;
  public provider?: ethers.providers.Web3Provider;
  private walletStorage: WalletStateStorage = new WalletStateStorage(
    CHAIN_ETHEREUM,
    WALLET_ID.ETHEREUM_METAMASK
  );
  public name: string = "METAMASK";
  public type: EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK;

  constructor(state?: MetamaskState) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }

    this.setupInitialState();
  }

  private async _getProvider(): Promise<ethers.providers.Web3Provider> {
    const ethereum = (await useWindow(
      async (windowObject) => (windowObject as any).ethereum
    )) as any;

    if (!Boolean(ethereum)) {
      throw new WalletNotInstalledError();
    }

    return new ethers.providers.Web3Provider(ethereum);
  }

  private _enforceIsConnected(): void {
    if (!this.getIsConnected()) {
      throw new WalletNotConnectedError();
    }
  }

  private async _enforceChain(): Promise<void> {
    if (this.chain === null) return;

    const provider = await this._getProvider();
    const currentChain: string = await provider.send("eth_chainId", []);

    if (currentChain !== this.chain) {
      throw new Error(
        `Chain has changed to ${currentChain} when it should be ${this.chain}`
      );
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    this.provider = await this._getProvider();

    return WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const provider = await this._getProvider();
    this.state.accounts = await provider.send("eth_requestAccounts", []);
    this.state.isConnected = this.state.accounts.length > 0;

    this.updateWalletStorageValue();

    this.hookRouter.applyHookWithArgs(
      WALLET_HOOK.ACCOUNT_ON_CHANGE,
      this.state.accounts
    );
    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this._enforceIsConnected();
    this.state.accounts = [];
    this.state.isConnected = false;

    this.updateWalletStorageValue();
    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<ethers.providers.JsonRpcSigner> {
    this._enforceChain();
    this._enforceIsConnected();

    const provider = this.provider || (await this._getProvider());

    return provider.getSigner();
  }

  public async getBalance(): Promise<string> {
    this._enforceChain();
    this._enforceIsConnected();

    const provider = this.provider || (await this._getProvider());
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
      (windowObject) => (windowObject as any).ethereum
    ) as any;

    return Boolean(ethereum);
  }

  public getPrimaryAccount(): string {
    this._enforceChain();
    this._enforceIsConnected();

    return this.state.accounts[0];
  }

  public getAccounts(): string[] {
    this._enforceChain();
    this._enforceIsConnected();

    return this.state.accounts;
  }

  public async fetchCurrentChainID(): Promise<string> {
    const provider: ethers.providers.Web3Provider = await this._getProvider();
    const chainId = await provider.send("eth_chainId", []);

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

  public async switchChainFromWallet(chain: number) {
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

  public async forceCurrentChainID(chain: number): Promise<void> {
    if (this.chain !== null && this.chain !== `0x${chain}`) {
      throw new Error(
        `Cannot force chain to be 0x${chain} because it is already forced to be 0x${this.chain}`
      );
    }

    this.chain = `0x${chain}`;
    this.switchChainFromWallet(chain);
  }

  public onAccountChange = (
    cb: (accounts: string[]) => void | Promise<void>
  ) => {
    return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, cb);
  };

  public onChainChange = (cb: (chain: string) => void | Promise<void>) => {
    return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_CHANGE, cb);
  };

  public onAccountDisconnect = (cb: () => void | Promise<void>) => {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
      cb
    );
  };

  public onChainDisconnect = (cb: () => void | Promise<void>) => {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.CHAIN_ON_DISCONNECT,
      cb
    );
  };

  public onBlockAdded = (cb: (newBlock: number) => void | Promise<void>) => {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.NEW_BLOCK,
      (block: number) => {
        return cb(block);
      }
    );
  };

  public toJSON(): MetamaskState {
    return this.state;
  }

  public async mountEventListeners(): Promise<void> {
    const provider = await this._getProvider();
    if (typeof window !== "undefined" && "ethereum" in window) {
      const ethereum = useWindow((window: any) => window.ethereum);
      if (ethereum.on) {
        ethereum.on("accountsChanged", async (accounts: string[]) => {
          this.state.accounts = ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length === 0) {
            await this.signOut();
          } else {
            this.hookRouter.applyHookWithArgs(
              WALLET_HOOK.ACCOUNT_ON_CHANGE,
              accounts
            );
          }
          this.updateWalletStorageValue();
        });

        ethereum.on("chainChanged", async (chainId: string) => {
          this.hookRouter.applyHookWithArgs(
            WALLET_HOOK.CHAIN_ON_CHANGE,
            chainId
          );
        });

        ethereum.on("disconnect", async (err: Error) => {
          this.hookRouter.applyHooks([WALLET_HOOK.CHAIN_ON_DISCONNECT]);
        });
      }
    }

    provider.on("block", (block: number) => {
      this.hookRouter.applyHookWithArgs(WALLET_HOOK.NEW_BLOCK, block);
    });
  }

  public async unmountEventListeners() {
    const provider = await this._getProvider();
    provider.removeAllListeners();
  }

  public async getProvider(): Promise<ethers.providers.Web3Provider> {
    await this._enforceChain();

    return this._getProvider();
  }

  private setupInitialState() {
    const storageValue = this.walletStorage.getValue();

    if (storageValue) {
      this.state = {
        isConnected: storageValue.isConnected,
        accounts: storageValue.accounts,
      };
    }
  }

  private updateWalletStorageValue() {
    if (this.state.isConnected && this.state.accounts.length > 0) {
      this.walletStorage.updateValue(
        true,
        this.getPrimaryAccount(),
        this.state.accounts
      );
    } else {
      this.walletStorage.updateValue(false, "", []);
    }
  }
}

export { Metamask };
