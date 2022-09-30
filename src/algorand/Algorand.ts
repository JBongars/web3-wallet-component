import { MyAlgo, MyAlgoTransaction } from "./myalgo";
import { MyAlgoSigner, MyAlgoState } from "./myalgo/types";
import { WalletConnect, WalletConnectTransaction } from "./walletconnect";
import { WalletConnectSigner, WalletConnectState } from "./walletconnect/types";
import { PeraWallet, PeraWalletTransaction } from "./perawallet";
import { PeraWalletSigner, PeraWalletState } from "./perawallet/types";
import { ChainWalletInterface, WalletInterface } from "../types";
import { HookEvent, WALLET_STATUS } from "../utils/HookRouter/types";
import { Accounts } from "@randlabs/myalgo-connect";
import { NotImplementedError } from "../errors";
import { WALLET_TYPE } from "../config/wallets";

type AlgorandWallet = MyAlgo | WalletConnect | PeraWallet;
type AlgorandWalletType =
  | WALLET_TYPE.ALGORAND_MYALGO
  | WALLET_TYPE.ALGORAND_PERAWALLET
  | WALLET_TYPE.ALGORAND_WALLETCONNECT;

// needs to be removed
type AlgorandSignerTxn =
  | MyAlgoTransaction
  | WalletConnectTransaction
  | PeraWalletTransaction;

type AlgorandSigner = MyAlgoSigner | WalletConnectSigner | PeraWalletSigner;

type AlgorandState = {
  myAlgo?: MyAlgoState;
  walletConnect?: WalletConnectState;
  peraWallet?: PeraWalletState;
};

class Algorand
  implements
    WalletInterface<unknown>,
    ChainWalletInterface<AlgorandWallet, AlgorandWalletType>
{
  public _myAlgo: MyAlgo;
  public _walletConnect: WalletConnect;
  public _peraWallet: PeraWallet;
  private _initialized: boolean = false;
  private _activeWallets: AlgorandWalletType[] = [];
  private _defaultWallet: AlgorandWalletType;

  constructor(
    data?: AlgorandState,
    defaultWallet: AlgorandWalletType = WALLET_TYPE.ALGORAND_MYALGO
  ) {
    this._myAlgo = new MyAlgo(data?.myAlgo);
    this._walletConnect = new WalletConnect(data?.walletConnect);
    this._peraWallet = new PeraWallet(data?.peraWallet);
    this._defaultWallet = defaultWallet;
  }

  private _registerActiveWallet = (type: AlgorandWalletType): void => {
    this._activeWallets.push(type);
  };

  private _deregisterActiveWallet = (type: AlgorandWalletType): void => {
    this._activeWallets = this._activeWallets.filter((elem) => elem !== type);
  };

  private _initAlgorandWallet = (
    algoWallet: AlgorandWallet
  ): AlgorandWallet => {
    const onAccountChange = (accounts: Accounts[]) => {
      if (accounts.length < 1) {
        this._deregisterActiveWallet(algoWallet.type);
      } else {
        this._registerActiveWallet(algoWallet.type);
      }
    };

    const onAccountDisconnect = () => {
      this._deregisterActiveWallet(algoWallet.type);
    };

    if (algoWallet.getIsWalletInstalled()) {
      algoWallet.init();

      algoWallet.onAccountChange(onAccountChange);
      algoWallet.onAccountDisconnect(onAccountDisconnect);
    } else {
      console.warn("Selected algorand wallet is not currently installed...");
    }

    return algoWallet;
  };

  public async init(): Promise<WALLET_STATUS> {
    if (this._initialized) {
      return WALLET_STATUS.OK;
    }

    this._initialized = true;
    await Promise.all(
      [this._myAlgo, this._walletConnect, this._peraWallet].map(
        this._initAlgorandWallet
      )
    );

    return WALLET_STATUS.OK;
  }

  public getWallet(type: AlgorandWalletType): AlgorandWallet {
    switch (type) {
      case WALLET_TYPE.ALGORAND_MYALGO:
        return this._myAlgo;
      case WALLET_TYPE.ALGORAND_WALLETCONNECT:
        return this._walletConnect;
      case WALLET_TYPE.ALGORAND_PERAWALLET:
        return this._peraWallet;
      default:
        throw new Error(`Wallet type ${type} cannot be found`);
    }
  }

  public getActiveWallet(): AlgorandWallet {
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

  public getPrimaryAccount(): Accounts {
    return this.getActiveWallet().getPrimaryAccount();
  }

  public getAccounts(): Accounts[] {
    return this.getActiveWallet().getAccounts();
  }

  public fetchCurrentChainID(): Promise<string> {
    return this.getActiveWallet().fetchCurrentChainID();
  }

  public mountEventListeners(): Promise<void> {
    throw new NotImplementedError();
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

export { Algorand, AlgorandWalletType, AlgorandState };

export type { AlgorandWallet, AlgorandSigner, AlgorandSignerTxn };
