import { WALLET_TYPE } from "../config/wallets";
import { NotImplementedError } from "../errors";
import { ChainWalletInterface, WalletInterface } from "../types";
import { HookEvent, WALLET_STATUS } from "../utils/HookRouter/types";
import { Metamask } from "./metamask";
import { MetamaskSigner, MetamaskState } from "./metamask/types";
import { EthWalletConnect } from "./walletconnect";
import { WalletConnectState } from "./walletconnect/types";

type EthereumWallet = Metamask | EthWalletConnect;

type EthereumWalletType =
  | WALLET_TYPE.ETHEREUM_METAMASK
  | WALLET_TYPE.ETHEREUM_WALLETCONNECT;

type EthereumSigner = MetamaskSigner;

type EthereumState = {
  metaMask?: MetamaskState;
  walletConnect?: WalletConnectState;
  activeWallets: EthereumWalletType[];
};

class Ethereum
  implements
    WalletInterface<unknown>,
    ChainWalletInterface<EthereumWallet, EthereumWalletType>
{
  private _metaMask: Metamask;
  private _walletConnect: EthWalletConnect;
  private _initialized: boolean = false;
  private _activeWallets: EthereumWalletType[] = [];
  private _defaultWallet: EthereumWalletType;

  constructor(
    data?: EthereumState,
    defaultWallet: EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK
  ) {
    this._metaMask = new Metamask(data?.metaMask);
    this._walletConnect = new EthWalletConnect();
    this._defaultWallet = defaultWallet;
  }

  private _registerActiveWallet = (type: EthereumWalletType) => {
    this._activeWallets.push(type);
  };

  private _deregisterActiveWallet = (type: EthereumWalletType) => {
    const index = this._activeWallets.indexOf(type);
    this._activeWallets = this._activeWallets.splice(index, 1);
  };

  private _initEthereumWallet = async (wallet: EthereumWallet) => {
    const onAccountChange = (accounts: string[]) => {
      if (accounts.length < 1) {
        this._deregisterActiveWallet(wallet.type);
      } else {
        this._registerActiveWallet(wallet.type);
      }
    };

    const onAccountDisconnect = () => {
      this._deregisterActiveWallet(wallet.type);
    };

    if (wallet.getIsWalletInstalled()) {
      await wallet.init();
      await wallet.mountEventListeners();

      wallet.onAccountChange(onAccountChange);
      wallet.onAccountDisconnect(onAccountDisconnect);
    } else {
      console.warn(`${wallet.name} is not currently installed...`);
    }
  };

  public async init(): Promise<WALLET_STATUS> {
    if (this._initialized) {
      return WALLET_STATUS.OK;
    }

    await Promise.all(
      [this._metaMask, this._walletConnect].map(this._initEthereumWallet)
    );

    this._initialized = true;
    return WALLET_STATUS.OK;
  }

  public getWallet(type: EthereumWalletType): EthereumWallet {
    switch (type) {
      case WALLET_TYPE.ETHEREUM_WALLETCONNECT:
        return this._walletConnect;
      case WALLET_TYPE.ETHEREUM_METAMASK:
        return this._metaMask;
      default:
        throw new Error(`Wallet type ${type} cannot be found`);
    }
  }

  public getActiveWallet(): EthereumWallet {
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

  public getPrimaryAccount(): string {
    return this.getActiveWallet().getPrimaryAccount();
  }

  public getAccounts(): string[] {
    return this.getActiveWallet().getAccounts();
  }

  public fetchCurrentChainID(): Promise<string> {
    return this.getActiveWallet().fetchCurrentChainID();
  }

  public mountEventListeners(): Promise<void> {
    throw new NotImplementedError();
  }

  public onAccountDisconnect = (cb: () => void | Promise<void>): HookEvent => {
    throw new NotImplementedError();
  };

  public onAccountChange = (
    cb: (accounts: unknown) => void | Promise<void>
  ): HookEvent => {
    throw new NotImplementedError();
  };

  public onChainChange = (
    cb: (chainId: string) => void | Promise<void>
  ): HookEvent => {
    throw new NotImplementedError();
  };

  public onBlockAdded = (
    cb: (block: unknown) => void | Promise<void>
  ): HookEvent => {
    throw new NotImplementedError();
  };

  public toJSON(): unknown {
    throw new NotImplementedError();
  }
}

export type { EthereumWallet, EthereumSigner, EthereumState };
export { Ethereum, EthereumWalletType };
