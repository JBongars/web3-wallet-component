import { ethers } from "ethers";
import { CHAIN_TYPE, WALLET_TYPE } from "../config/wallets";
import { NotImplementedError, WalletNotInstalledError } from "../errors";
import {
  ChainHookHandlerInterface,
  ChainWalletInterface,
  WalletInterface,
} from "../types";
import HookRouter from "../utils/HookRouter";
import {
  HookEvent,
  WALLET_HOOK,
  WALLET_STATUS,
} from "../utils/HookRouter/types";
import { Metamask } from "./metamask";
import { MetamaskAsset, MetamaskSigner, MetamaskState } from "./metamask/types";
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

type EthereumConfig = {
  hookType: "all" | "active" | "disable";
  defaultWallet: EthereumWalletType;
};

const defaultEthereumConfig: EthereumConfig = {
  hookType: "active",
  defaultWallet: WALLET_TYPE.ETHEREUM_METAMASK,
};

class Ethereum
  implements
    WalletInterface<unknown>,
    ChainHookHandlerInterface<EthereumWalletType>,
    ChainWalletInterface<EthereumWallet, EthereumWalletType>
{
  private hookRouter: HookRouter = new HookRouter([
    WALLET_HOOK.CHAIN_ON_CHANGE,
    WALLET_HOOK.CHAIN_ON_DISCONNECT,
    WALLET_HOOK.ACCOUNT_ON_CHANGE,
    WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
    WALLET_HOOK.NEW_BLOCK,
  ]);

  private _metaMask: Metamask;
  private _walletConnect: EthWalletConnect;
  private _initialized: boolean = false;
  private _activeWallets: EthereumWalletType[] = [];
  private _config: EthereumConfig;

  public type: CHAIN_TYPE = CHAIN_TYPE.ETHEREUM;
  public name: string = "ETHEREUM";

  constructor(config: Partial<EthereumConfig>, data?: EthereumState) {
    this._metaMask = new Metamask(data?.metaMask);
    this._walletConnect = new EthWalletConnect(data?.walletConnect);
    this._config = { ...defaultEthereumConfig, ...config };
  }

  private _mountInternalHooks = (wallet: EthereumWallet) => {
    const verifyWallet = (walletType: EthereumWalletType) => {
      switch (this._config.hookType) {
        case "active":
          return this._activeWallets[0] === walletType;
        case "all":
          return true;
        default:
          return false;
      }
    };

    const hook =
      (hookType: WALLET_HOOK) =>
      (...args: any) => {
        if (!verifyWallet(wallet.type)) {
          return;
        }

        this.hookRouter.applyHookWithArgs(hookType, ...[wallet.type, ...args]);
      };

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

    wallet.onAccountChange(hook(WALLET_HOOK.ACCOUNT_ON_CHANGE));
    wallet.onAccountDisconnect(hook(WALLET_HOOK.ACCOUNT_ON_DISCONNECT));
    wallet.onChainChange(hook(WALLET_HOOK.CHAIN_ON_CHANGE));
    wallet.onChainDisconnect(hook(WALLET_HOOK.CHAIN_ON_DISCONNECT));

    wallet.onAccountChange(onAccountChange);
    wallet.onAccountDisconnect(onAccountDisconnect);

    // onBlockAdded is a chain and not a wallet specific event
    // so wallet type is not required
    if (wallet.type === this._config.defaultWallet) {
      wallet.onBlockAdded((newBlock: number) => {
        this.hookRouter.applyHookWithArgs(WALLET_HOOK.NEW_BLOCK, [newBlock]);
      });
    }
  };

  private _registerActiveWallet = (type: EthereumWalletType) => {
    this._activeWallets.unshift(type);
  };

  private _deregisterActiveWallet = (type: EthereumWalletType) => {
    const index = this._activeWallets.indexOf(type);
    this._activeWallets = this._activeWallets.splice(index, 1);
  };

  private _initEthereumWallet = async (wallet: EthereumWallet) => {
    if (wallet.getIsWalletInstalled()) {
      await wallet.init();
      await wallet.mountEventListeners();
      await this._mountInternalHooks(wallet);
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

  public getAvailableWallets(): EthereumWalletType[] {
    const walletTypes: EthereumWalletType[] = [
      WALLET_TYPE.ETHEREUM_METAMASK,
      WALLET_TYPE.ETHEREUM_WALLETCONNECT,
    ];

    return walletTypes.filter((walletType) =>
      this.getWallet(walletType).getIsWalletInstalled()
    );
  }

  public getConnectedWallets(): EthereumWalletType[] {
    const walletTypes: EthereumWalletType[] = [
      WALLET_TYPE.ETHEREUM_METAMASK,
      WALLET_TYPE.ETHEREUM_WALLETCONNECT,
    ];

    return walletTypes.filter((walletType) =>
      this.getWallet(walletType).getIsConnected()
    );
  }

  public getActiveWallet(): EthereumWallet {
    if (this._activeWallets.length === 0) {
      return this.getWallet(this._config.defaultWallet); // Get default wallet
    }
    return this.getWallet(this._activeWallets[0]);
  }

  public updateActiveWallet(type: EthereumWalletType): EthereumWallet {
    this._registerActiveWallet(type);
    return this.getWallet(type);
  }

  public signIn(): Promise<WALLET_STATUS> {
    return this.getActiveWallet().signIn();
  }

  public signOut(): Promise<WALLET_STATUS> {
    return this.getActiveWallet().signOut();
  }

  public getSigner(): Promise<EthereumSigner> {
    return this.getActiveWallet().getSigner();
  }

  public getBalance(): Promise<string> {
    return this.getActiveWallet().getBalance();
  }

  public getAssets(): Promise<MetamaskAsset[]> {
    return this.getActiveWallet().getAssets();
  }

  public getProvider(): Promise<ethers.providers.Web3Provider> {
    return this.getActiveWallet().getProvider();
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

  public onAccountChange = (
    cb: (
      walletType: EthereumWalletType,
      accounts: string[]
    ) => void | Promise<void>
  ) => {
    return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, cb);
  };

  public onChainChange = (
    cb: (walletType: EthereumWalletType, chain: string) => void | Promise<void>
  ) => {
    return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_CHANGE, cb);
  };

  public onAccountDisconnect = (
    cb: (walletType: EthereumWalletType) => void | Promise<void>
  ) => {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
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

  public toJSON(): unknown {
    throw new NotImplementedError();
  }
}

export type { EthereumWallet, EthereumSigner, EthereumState, EthereumConfig };
export { Ethereum, EthereumWalletType, defaultEthereumConfig };
