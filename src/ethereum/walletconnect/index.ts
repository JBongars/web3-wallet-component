import { WalletInterface } from "../../types";
import {
  WalletConnectAsset,
  WalletConnectChainConfig,
  WalletConnectSigner,
  WalletConnectState,
} from "./types";
import { ethers, providers } from "ethers";
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
import {
  WALLET_HOOK,
  WALLET_ID,
  WALLET_STATUS,
} from "~/src/utils/HookRouter/types";
import { getChainConfig } from "./chains";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletStateStorage from "~/src/WalletStateStorage";
import { CHAIN_ETHEREUM, EthereumWalletType } from "..";

const initialState: Readonly<WalletConnectState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class EthWalletConnect implements WalletInterface<WalletConnectState> {
  private hookRouter: HookRouter = new HookRouter([
    WALLET_HOOK.CHAIN_ON_CHANGE,
    WALLET_HOOK.CHAIN_ON_DISCONNECT,
    WALLET_HOOK.ACCOUNT_ON_CHANGE,
    WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
    WALLET_HOOK.NEW_BLOCK,
  ]);
  private chain: string | null = null;
  public state: WalletConnectState;
  public provider?: ethers.providers.Web3Provider;
  private walletStorage = new WalletStateStorage(
    CHAIN_ETHEREUM,
    WALLET_ID.ETHEREUM_WALLETCONNECT
  );
  public name: string = "WALLET_CONNECT";
  public type: EthereumWalletType = EthereumWalletType.ETH_WALLET_CONNECT;

  constructor(state?: WalletConnectState) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
    this.setupInitialState();
  }

  private async _getProvider(): Promise<ethers.providers.Web3Provider> {
    const provider = await this.getWCProvider();
    return new providers.Web3Provider(provider);
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

  public async getWCProvider(): Promise<WalletConnectProvider> {
    const walletConnectProvider = new WalletConnectProvider({
      infuraId: "f83857b162d64708b25a59585f969fbd", // Required
      qrcode: true,
    });
    await walletConnectProvider.enable();

    return walletConnectProvider;
  }

  public async init(): Promise<WALLET_STATUS> {
    this.provider = await this._getProvider();

    return WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const provider = await this._getProvider();
    this.state.accounts = await provider.listAccounts();
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
    this.provider = undefined;
    this.updateWalletStorageValue();
    (await this.getWCProvider()).disconnect();

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

    const provider = await this._getProvider();
    const balance = await provider.getBalance(this.state.accounts[0]);
    return balance.toString();
  }

  public async getAssets(): Promise<WalletConnectAsset[]> {
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
    chainConfig: WalletConnectChainConfig
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

  public onAccountChange(cb: (accounts: string[]) => void | Promise<void>) {
    return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, cb);
  }

  public onChainChange(cb: (chain: string) => void | Promise<void>) {
    return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_CHANGE, cb);
  }

  public onAccountDisconnect(cb: () => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
      cb
    );
  }

  public onChainDisconnect(cb: () => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.CHAIN_ON_DISCONNECT,
      cb
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

  public toJSON(): WalletConnectState {
    return this.state;
  }

  public async mountEventListeners() {}

  public async unmountEventListeners() {}

  public async getProvider(): Promise<ethers.providers.Web3Provider> {
    await this._enforceChain();
    return await this._getProvider();
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
        this.state.accounts[0],
        this.state.accounts
      );
    } else {
      this.walletStorage.updateValue(false, "", []);
    }
  }
}

export { EthWalletConnect };
