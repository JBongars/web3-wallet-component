import { Metamask } from "./metamask";
import { EthWalletConnect } from "./walletconnect";
import { WalletConnectState } from "./walletconnect/types";
import { MetamaskState, MetamaskSigner } from "./metamask/types";
import { WALLET, WalletInterface } from "../types";
import { HookEvent, WALLET_STATUS } from "../utils/HookRouter/types";
import { NotImplementedError } from "../errors";

type EthereumWallet = Metamask | EthWalletConnect;

enum EthereumWalletType {
  METMASK,
  ETH_WALLET_CONNECT,
}

type EthereumSigner = MetamaskSigner;

type EthereumState = {
  metaMask?: MetamaskState;
  walletConnect?: WalletConnectState;
  activeWallets: EthereumWalletType[];
};

class Ethereum implements WalletInterface<unknown> {
  private _metaMask: Metamask;
  private _walletConnect: EthWalletConnect;
  private _initialized: boolean = false;
  private _activeWallets: EthereumWalletType[] = [];
  private _defaultWallet: EthereumWalletType;

  constructor(
    data?: EthereumState,
    defaultWallet: EthereumWalletType = EthereumWalletType.METMASK
  ) {
    this._metaMask = new Metamask(data?.metaMask);
    this._walletConnect = new EthWalletConnect();
    this._defaultWallet = defaultWallet;
  }

  private _registerActiveWallet(type: EthereumWalletType) {
    return () => {
      this._activeWallets.push(type);
    };
  }

  private _deregisterActiveWallet(type: EthereumWalletType) {
    return () => {
      const index = this._activeWallets.indexOf(type);
      this._activeWallets = this._activeWallets.splice(index, 1);
    };
  }

  private async _initEthereumWallet(wallet: EthereumWallet) {
    if (wallet.getIsWalletInstalled()) {
      await wallet.init();
      await wallet.mountEventListeners();

      wallet.onAccountChange((accounts: string[]) => {
        if (accounts.length < 1) {
          this._deregisterActiveWallet(wallet.type);
        } else {
          this._registerActiveWallet(wallet.type);
        }
      });

      wallet.onAccountDisconnect(() => {
        this._deregisterActiveWallet(wallet.type);
      });
    } else {
      console.warn(`${wallet.name} is not currently installed...`);
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    if (this._initialized) {
      return WALLET_STATUS.OK;
    }

    this._initialized = true;
    await Promise.all(
      [this._metaMask, this._walletConnect].map(this._initEthereumWallet)
    );

    return WALLET_STATUS.OK;
  }

  public getWallet(type: EthereumWalletType) {
    switch (type) {
      case EthereumWalletType.ETH_WALLET_CONNECT:
        return this._walletConnect;
      case EthereumWalletType.METMASK:
        return this._metaMask;
    }
  }

  public getActiveWallet() {
    if (this._activeWallets.length === 0) {
      return this.getWallet(this._defaultWallet); // Get default wallet
    }
    return this.getWallet(this._activeWallets[0]);
  }

  public signIn(): Promise<WALLET_STATUS> {
    return this.getActiveWallet().signIn();
  }

  public signOut(): Promise<WALLET_STATUS> {
    return this.getActiveWallet().signOut();
  }

  public getSigner(): Promise<unknown> {
    return this.getActiveWallet().getSigner();
  }

  public getBalance(): Promise<string> {
    return this.getActiveWallet().getBalance();
  }

  public getAssets(): Promise<unknown[]> {
    return this.getActiveWallet().getAssets();
  }

  public getIsConnected(): boolean {
    return this.getActiveWallet().getIsConnected();
  }

  public getIsWalletInstalled(): boolean {
    return this.getActiveWallet().getIsWalletInstalled();
  }

  public getPrimaryAccount(): unknown {
    return this.getActiveWallet().getPrimaryAccount();
  }

  public getAccounts(): unknown[] {
    return this.getActiveWallet().getAccounts();
  }

  public fetchCurrentChainID(): Promise<string> {
    return this.getActiveWallet().fetchCurrentChainID();
  }

  public onAccountChange(
    cb: (accounts: unknown) => void | Promise<void>
  ): HookEvent {
    throw new NotImplementedError();
  }

  public onChainChange(
    cb: (chainId: string) => void | Promise<void>
  ): HookEvent {
    throw new NotImplementedError();
  }

  public onBlockAdded(cb: (block: unknown) => void | Promise<void>): HookEvent {
    throw new NotImplementedError();
  }

  public toJSON(): unknown {
    throw new NotImplementedError();
  }
}

export type { EthereumWallet, EthereumSigner, Ethereum, EthereumState };

export { EthereumWalletType };
