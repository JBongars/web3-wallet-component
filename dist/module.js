import {isValidAddress as $hgUW1$isValidAddress} from "algosdk";
import {isAddress as $hgUW1$isAddress} from "ethers/lib/utils";
import {ethers as $hgUW1$ethers, providers as $hgUW1$providers} from "ethers";
import $hgUW1$coinbasewalletsdk from "@coinbase/wallet-sdk";
import $hgUW1$walletconnectweb3provider from "@walletconnect/web3-provider";
import $hgUW1$randlabsmyalgoconnect from "@randlabs/myalgo-connect";
import {formatJsonRpcRequest as $hgUW1$formatJsonRpcRequest} from "@json-rpc-tools/utils";
import {PeraWalletConnect as $hgUW1$PeraWalletConnect} from "@perawallet/connect";
import {Buffer as $hgUW1$Buffer} from "buffer";
import $hgUW1$walletconnectclient from "@walletconnect/client";
import $hgUW1$algorandwalletconnectqrcodemodal from "algorand-walletconnect-qrcode-modal";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
var $81c1b644006d48ec$exports = {};


var $28ac839a9eca26f5$exports = {};

$parcel$export($28ac839a9eca26f5$exports, "NotImplementedError", () => $28ac839a9eca26f5$export$e162153238934121);
$parcel$export($28ac839a9eca26f5$exports, "WalletNotInstalledError", () => $28ac839a9eca26f5$export$72563c16b91dfd16);
$parcel$export($28ac839a9eca26f5$exports, "WalletNotConnectedError", () => $28ac839a9eca26f5$export$313d299817c74896);
$parcel$export($28ac839a9eca26f5$exports, "HookNotAvailableError", () => $28ac839a9eca26f5$export$f4d277c155d1965e);
/**
 * Method or function is not implemented
 */ class $28ac839a9eca26f5$export$e162153238934121 extends Error {
    constructor(message = "NotImplementedError"){
        super(message);
        this.name = "NotImplementedError";
    }
}
/**
 * Wallet method was invoked although wallet was not installed
 */ class $28ac839a9eca26f5$export$72563c16b91dfd16 extends Error {
    constructor(message = "WalletNotInstalledError"){
        super(message);
        this.name = "WalletNotInstalledError";
    }
}
/**
 * Wallet method was invoked although wallet was not connected
 */ class $28ac839a9eca26f5$export$313d299817c74896 extends Error {
    constructor(message = "WalletNotConnectedError"){
        super(message);
        this.name = "WalletNotConnectedError";
    }
}
/**
 * Hook was registered with an event that is not supported
 */ class $28ac839a9eca26f5$export$f4d277c155d1965e extends Error {
    constructor(message = "HookNotAvailableError"){
        super(message);
        this.name = "HookNotAvailableError";
    }
}


var $61dc865ce14f4bf4$exports = {};
var $05db05568a951b86$exports = {};
var $63a99e75275a61fa$exports = {};

$parcel$export($63a99e75275a61fa$exports, "Metamask", () => $63a99e75275a61fa$export$2c78a3b4fc11d8fa);

/**
 * Handles callback hooks for wallet/ chain events
 * @see WALLET_HOOK for available hooks
 * @remarks Should only be used internally as this component is prone to changing
 * @internal
 * @example
 * ```ts
 * const hookRouter = new HookRouter([WALLET_HOOK.NEW_BLOCK]); // init hook router
 * hookRouter.registerCallback(WALLET_HOOK.NEW_BLOCK, () => console.log("hello hook!")); // create a new hook
 * hookRouter.applyHooks([WALLET_HOOK.NEW_BLOCK]); // >> hello hook!
 * ```
 */ class $826e60e3117e96ce$export$3e7b7dba1fab7538 {
    /**
     * Initializes the hook router to start listening for hooks
     * @param hooks - List of hooks the HookRouter should listen for
     */ constructor(hooks){
        this.hooks = new Map();
        this.availableHooks = hooks;
        this.resetAllHooks();
    }
    /**
     * Check if hook router is listening to a hook
     * @param hook - hook enum
     */ checkIfValidHook(hook) {
        if (!this.hooks.has(hook)) throw new (0, $28ac839a9eca26f5$export$f4d277c155d1965e)();
    }
    /**
     * self descriptive
     * @returns list of available hooks
     */ getAvailableHooks() {
        return [
            ...this.availableHooks
        ];
    }
    /**
     * clear all hooks registered to an event
     * @param hook - hook enum
     */ resetHook(hook) {
        this.checkIfValidHook(hook);
        this.hooks.delete(hook);
        this.hooks.set(hook, new Map());
    }
    /**
     * clears all available hooks resetting the hook router
     */ resetAllHooks() {
        this.availableHooks.forEach((hook)=>{
            this.hooks.set(hook, new Map());
        });
    }
    /**
     * Register a new hook that will be called when the hook event is triggered
     * @param hook - hook enum
     * @param cb - callback to invoke when the hook is called
     * @returns a hook event
     * @see HookEvent
     * @see applyHooks
     * @remarks if a hook is expecting to be called with an argument, use @see applyHookWithArgs
     */ registerCallback(hook, cb) {
        this.checkIfValidHook(hook);
        const id = Symbol();
        this.hooks.get(hook)?.set(id, cb);
        return {
            id: id,
            destroy: ()=>this.deregisterCallback(hook, id)
        };
    }
    /**
     * Deregisters a particular hook
     * @param hook - hook enum
     * @param id - hook id found in the @see HookEvent
     * @remarks hooks can also be deregistered using the @see HookEvent.destroy method
     */ deregisterCallback(hook, id) {
        this.checkIfValidHook(hook);
        this.hooks.get(hook)?.delete(id);
    }
    /**
     * Calls all hooks that are specified
     * @param hooks - list of hook enums
     * @remarks Use @see applyHookWithArgs if hooks should be called with args
     */ async applyHooks(hooks) {
        const callbacksToInvoke = [];
        hooks.forEach((hook)=>{
            this.hooks.get(hook)?.forEach((fn)=>callbacksToInvoke.push(fn));
        });
        await Promise.all(callbacksToInvoke.map((fn)=>fn()));
    }
    /**
     * Calls a hook with a list of arguments
     * @param hook - hook enum
     * @param args - argument to pass to the hook callback
     * @remarks args are destructured
     */ async applyHookWithArgs(hook, ...args) {
        const callbacksToInvoke = [];
        this.hooks.get(hook)?.forEach((fn)=>callbacksToInvoke.push(fn));
        await Promise.all(callbacksToInvoke.map((fn)=>fn(...args)));
    }
}
var $826e60e3117e96ce$export$2e2bcd8739ae039 = $826e60e3117e96ce$export$3e7b7dba1fab7538;


let /**
 * Wallet statuses
 */ $90bab4f8b8f7e96d$export$de76a1f31766a0a2;
(function(WALLET_STATUS) {
    WALLET_STATUS[WALLET_STATUS[/**
     * Wallet is OK
     */ "OK"] = 0] = "OK";
    WALLET_STATUS[WALLET_STATUS[/**
     * There was a problem logging in
     * @remarks user may have cancelled the transaction
     */ "LOGIN_ERROR"] = 1] = "LOGIN_ERROR";
    WALLET_STATUS[WALLET_STATUS[/**
     * There was a problem initializing the wallet
     */ "WALLET_ERROR"] = 2] = "WALLET_ERROR";
    WALLET_STATUS[WALLET_STATUS[/**
     * There was a problem initializing the  wallet because the extension was not found
     */ "EXTENSION_NOT_FOUND"] = 3] = "EXTENSION_NOT_FOUND";
    WALLET_STATUS[WALLET_STATUS[/**
     * The Wallet account was not found
     */ "ACCOUNT_NOT_FOUND"] = 4] = "ACCOUNT_NOT_FOUND";
})($90bab4f8b8f7e96d$export$de76a1f31766a0a2 || ($90bab4f8b8f7e96d$export$de76a1f31766a0a2 = {}));
let /**
 * Identifier for Wallet
 * @remarks example Metamask, WalletConnect, etc...
 */ $90bab4f8b8f7e96d$export$7c460c214963f696;
(function(WALLET_ID) {
    WALLET_ID[WALLET_ID["ETHEREUM_NOWALLET"] = 0] = "ETHEREUM_NOWALLET";
    WALLET_ID[WALLET_ID["ETHEREUM_METAMASK"] = 1] = "ETHEREUM_METAMASK";
    WALLET_ID[WALLET_ID["ETHEREUM_WALLETCONNECT"] = 2] = "ETHEREUM_WALLETCONNECT";
    WALLET_ID[WALLET_ID["ETHEREUM_COINBASE"] = 3] = "ETHEREUM_COINBASE";
    WALLET_ID[WALLET_ID["ALGORAND_MYALGO"] = 4] = "ALGORAND_MYALGO";
    WALLET_ID[WALLET_ID["ALGORAND_WALLETCONNECT"] = 5] = "ALGORAND_WALLETCONNECT";
    WALLET_ID[WALLET_ID["ALGORAND_PERAWALLET"] = 6] = "ALGORAND_PERAWALLET";
})($90bab4f8b8f7e96d$export$7c460c214963f696 || ($90bab4f8b8f7e96d$export$7c460c214963f696 = {}));
let /**
 * Wallet Hook events
 * @remarks events are based on Metamask
 */ $90bab4f8b8f7e96d$export$5ee9bf08a91850b9;
(function(WALLET_HOOK) {
    WALLET_HOOK[WALLET_HOOK[/**
     * User has prompted to change chains on the wallet
     */ "CHAIN_ON_CHANGE"] = 0] = "CHAIN_ON_CHANGE";
    WALLET_HOOK[WALLET_HOOK["CHAIN_ON_DISCONNECT"] = 1] = "CHAIN_ON_DISCONNECT";
    WALLET_HOOK[WALLET_HOOK["ACCOUNT_ON_CHANGE"] = 2] = "ACCOUNT_ON_CHANGE";
    WALLET_HOOK[WALLET_HOOK["ACCOUNT_ON_DISCONNECT"] = 3] = "ACCOUNT_ON_DISCONNECT";
    WALLET_HOOK[WALLET_HOOK["NEW_BLOCK"] = 4] = "NEW_BLOCK";
    WALLET_HOOK[WALLET_HOOK["CONNECT"] = 5] = "CONNECT";
})($90bab4f8b8f7e96d$export$5ee9bf08a91850b9 || ($90bab4f8b8f7e96d$export$5ee9bf08a91850b9 = {}));


var $3b49e6787d3f4e23$exports = {};

$parcel$defineInteropFlag($3b49e6787d3f4e23$exports);

$parcel$export($3b49e6787d3f4e23$exports, "default", () => $3b49e6787d3f4e23$export$2e2bcd8739ae039);


var $42db31fbdbd10224$exports = {};
var $9ef2866eeb66da86$exports = {};

$parcel$export($9ef2866eeb66da86$exports, "WALLET_TYPE", () => $9ef2866eeb66da86$export$353aefc175350117);
$parcel$export($9ef2866eeb66da86$exports, "CHAIN_TYPE", () => $9ef2866eeb66da86$export$be56259456d697c6);
let /**
 * Wallet types representing low level wallets
 */ $9ef2866eeb66da86$export$353aefc175350117;
(function(WALLET_TYPE) {
    WALLET_TYPE[WALLET_TYPE["ETHEREUM_METAMASK"] = 0] = "ETHEREUM_METAMASK";
    WALLET_TYPE[WALLET_TYPE["ETHEREUM_WALLETCONNECT"] = 1] = "ETHEREUM_WALLETCONNECT";
    WALLET_TYPE[WALLET_TYPE["ETHEREUM_COINBASE"] = 2] = "ETHEREUM_COINBASE";
    WALLET_TYPE[WALLET_TYPE["ALGORAND_MYALGO"] = 3] = "ALGORAND_MYALGO";
    WALLET_TYPE[WALLET_TYPE["ALGORAND_WALLETCONNECT"] = 4] = "ALGORAND_WALLETCONNECT";
    WALLET_TYPE[WALLET_TYPE["ALGORAND_PERAWALLET"] = 5] = "ALGORAND_PERAWALLET";
})($9ef2866eeb66da86$export$353aefc175350117 || ($9ef2866eeb66da86$export$353aefc175350117 = {}));
let /**
 * Chain types representing blockchains above @see WALLET_TYPE are associated to
 */ $9ef2866eeb66da86$export$be56259456d697c6;
(function(CHAIN_TYPE) {
    CHAIN_TYPE[CHAIN_TYPE["ALGORAND"] = 0] = "ALGORAND";
    CHAIN_TYPE[CHAIN_TYPE["ETHEREUM"] = 1] = "ETHEREUM";
})($9ef2866eeb66da86$export$be56259456d697c6 || ($9ef2866eeb66da86$export$be56259456d697c6 = {}));


$parcel$exportWildcard($42db31fbdbd10224$exports, $9ef2866eeb66da86$exports);


var $8c78a71587639d7a$exports = {};
var $412a545945027ba9$exports = {};

$parcel$export($412a545945027ba9$exports, "useWindow", () => $412a545945027ba9$export$24b8fbafc4b6a151);
const $412a545945027ba9$export$24b8fbafc4b6a151 = (cb)=>{
    if (Object.keys(globalThis).includes("window")) return cb(globalThis.window);
    else return null;
};


$parcel$exportWildcard($8c78a71587639d7a$exports, $412a545945027ba9$exports);


const $3b49e6787d3f4e23$var$STORAGE_KEY = "wallet-state-storage";
/**
 *  Wallet Storage is used to make the wallet state persistent even after the user refreshes the page
 *  @remarks uses the Web Storage API and may not be compatible with older browsers
 *  Maybe be replaced with less coupled implementation in the future
 */ class $3b49e6787d3f4e23$var$WalletStateStorage {
    /**
     * Constructor for storage
     * @param chain - The chain identifier to use as key
     * @param walletId - Current wallet ID
     */ constructor(chain, walletId){
        this.chain = chain;
        this.walletId = walletId;
        this.storage = this._storage();
    }
    /**
     * gets the content of the storage per walletid
     * @returns the storage value for chain
     */ getValue() {
        const value = this.values().find((state)=>state.chain === this.chain && this.walletId == state.walletId) || null;
        if (value && !this.isValidAddress(value.connectedAccount)) return {
            isConnected: false,
            connectedAccount: "",
            chain: this.chain,
            walletId: this.walletId,
            accounts: value.accounts
        };
        return value;
    }
    /**
     * Updates the values saved in storage
     * @param isConnected - storage value to save
     * @param connectedAccount  - storage value to save
     * @param accounts  - storage value to save
     */ updateValue(isConnected, connectedAccount, accounts) {
        const exisitingValues = this.getValue();
        let values = this.values();
        if (exisitingValues) values = values.map((value)=>{
            if (value.chain === this.chain && value.walletId === this.walletId) return {
                chain: this.chain,
                isConnected: isConnected,
                connectedAccount: connectedAccount,
                walletId: this.walletId,
                accounts: accounts
            };
            return value;
        });
        else values = values.concat({
            chain: this.chain,
            isConnected: isConnected,
            connectedAccount: connectedAccount,
            walletId: this.walletId,
            accounts: accounts
        });
        this.storage?.setItem($3b49e6787d3f4e23$var$STORAGE_KEY, JSON.stringify(values));
    }
    /**
     * Validates the account string using respective chain methods
     * @param account - account string to check
     * @returns is account string valid
     */ isValidAddress(account) {
        switch(this.chain){
            case (0, $9ef2866eeb66da86$export$be56259456d697c6).ETHEREUM:
                return (0, $hgUW1$isAddress)(account);
            case (0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND:
                return (0, $hgUW1$isValidAddress)(account);
            default:
                return false;
        }
    }
    /**
     * parse raw value
     * @returns parsed values
     */ values() {
        const values = this._storage()?.getItem($3b49e6787d3f4e23$var$STORAGE_KEY);
        return values ? JSON.parse(values) : [];
    }
    _storage() {
        return (0, $412a545945027ba9$export$24b8fbafc4b6a151)((windowObject)=>windowObject.localStorage);
    }
}
var $3b49e6787d3f4e23$export$2e2bcd8739ae039 = $3b49e6787d3f4e23$var$WalletStateStorage;












const $6efec99b285d035b$export$92de899abf5da75a = {
    chainName: "Rinkeby Test Network",
    chainId: "0x4",
    nativeCurrency: {
        name: "ETH",
        decimals: 18,
        symbol: "ETH"
    },
    rpcUrls: [
        "https://rinkeby.etherscan.io"
    ]
};
const $6efec99b285d035b$export$abdf78135f8407bb = {
    chainName: "Rinkeby Test Network",
    chainId: "0x1",
    nativeCurrency: {
        name: "ETH",
        decimals: 18,
        symbol: "ETH"
    },
    rpcUrls: [
        "https://rinkeby.etherscan.io"
    ]
};
const $6efec99b285d035b$export$703a843624f42e6c = (chainId)=>{
    switch(chainId){
        case "0x1":
            return $6efec99b285d035b$export$abdf78135f8407bb;
        case "0x4":
            return $6efec99b285d035b$export$92de899abf5da75a;
        default:
            throw new Error(`ChainId ${chainId} configuration not found`);
    }
};


class $d808041ad48ee2f7$export$9e095c387372d0b1 {
    static getWindowEthereumObject() {
        return (0, $412a545945027ba9$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
    }
    static getNamedWindowEthereumObject(key, validator) {
        const ethereumGlobal = $d808041ad48ee2f7$export$9e095c387372d0b1.getWindowEthereumObject();
        if (!ethereumGlobal) throw new (0, $28ac839a9eca26f5$export$72563c16b91dfd16)();
        if (!ethereumGlobal.providerMap) {
            if (!validator(ethereumGlobal)) throw new (0, $28ac839a9eca26f5$export$72563c16b91dfd16)();
            return ethereumGlobal;
        }
        const ethereum = ethereumGlobal.providerMap.get(key);
        if (!ethereum || !validator(ethereum)) throw new (0, $28ac839a9eca26f5$export$72563c16b91dfd16)();
        return ethereum;
    }
    static getSigner(provider) {
        return provider.getSigner();
    }
    static async getBalance(provider, accountId) {
        const balance = await provider.getBalance(accountId);
        return balance.toString();
    }
    static async getAssets() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    static getIsWalletInstalled(ethereum) {
        return Boolean(ethereum);
    }
    static async fetchCurrentChainID(provider) {
        return provider.send("eth_chainId", []);
    }
    static async addChainToWallet(chainConfig) {
        (0, $412a545945027ba9$export$24b8fbafc4b6a151)(async (window)=>{
            const ethereum = window.ethereum;
            if (ethereum && ethereum.request) ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    chainConfig
                ]
            });
        });
    }
    static async switchChainFromWallet(ethereum, chainId) {
        if (!ethereum.request) throw new Error("EthereumProvider.request method is not available");
        try {
            return ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: chainId
                    }
                ]
            });
        } catch (err) {
            if (err && err.code === 4902) {
                const chainConfig = (0, $6efec99b285d035b$export$703a843624f42e6c)(chainId);
                return await this.addChainToWallet(chainConfig);
            } else throw err;
        }
    }
}






class $7bc8826faba50ebf$export$bf6aa8a8e97b6c5f {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $9ef2866eeb66da86$export$be56259456d697c6).ETHEREUM, (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ETHEREUM_NOWALLET);
    chain = null;
    constructor(){
        this._state = {
            accounts: [],
            isConnected: false
        };
    }
    _getEthereumProvider() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    _getProvider(ethereum = this._getEthereumProvider()) {
        return new (0, $hgUW1$ethers).providers.Web3Provider(ethereum);
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
    }
    _setupInitialState() {
        const storageValue = this._walletStorage.getValue();
        if (storageValue) this._state = {
            isConnected: storageValue.isConnected,
            accounts: storageValue.accounts
        };
    }
    _updateWalletStorageValue() {
        if (this._state.isConnected && this._state.accounts.length > 0) this._walletStorage.updateValue(true, this.getPrimaryAccount(), this._state.accounts);
        else this._walletStorage.updateValue(false, "", []);
    }
    async getSigner() {
        this._enforceIsConnected();
        const provider = this._getProvider();
        return (0, $d808041ad48ee2f7$export$9e095c387372d0b1).getSigner(provider);
    }
    async getBalance() {
        this._enforceIsConnected();
        const provider = this._getProvider();
        return await (0, $d808041ad48ee2f7$export$9e095c387372d0b1).getBalance(provider, this._state.accounts[0]);
    }
    async signOut() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    async getAssets() {
        return await (0, $d808041ad48ee2f7$export$9e095c387372d0b1).getAssets();
    }
    getIsConnected() {
        if (this._state.isConnected && this._state.accounts.length < 1) console.warn("wallet is marked as connected but the state.account length is 0");
        return this._state.isConnected;
    }
    getPrimaryAccount() {
        this._enforceIsConnected();
        if (this._state.accounts.length < 1) throw new Error("wallet is marked as connected but could not find primary account");
        return this._state.accounts[0];
    }
    getAccounts() {
        this._enforceIsConnected();
        if (this._state.accounts.length < 1) console.warn("wallet is marked as connected but could not find primary account");
        return this._state.accounts;
    }
    async fetchCurrentChainID() {
        const provider = await this._getProvider();
        return (0, $d808041ad48ee2f7$export$9e095c387372d0b1).fetchCurrentChainID(provider);
    }
    async addChainToWallet(chainConfig) {
        return (0, $d808041ad48ee2f7$export$9e095c387372d0b1).addChainToWallet(chainConfig);
    }
    async switchChainFromWallet(chain, updateChain = false) {
        const ethereum = this._getEthereumProvider();
        if (ethereum.networkVersion !== String(chain)) {
            await (0, $d808041ad48ee2f7$export$9e095c387372d0b1).switchChainFromWallet(ethereum, chain);
            if (updateChain) this.chain = chain;
        }
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    };
    onChainDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT, cb);
    };
    onBlockAdded = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK, (block)=>{
            return cb(block);
        });
    };
    getIsWalletInstalled() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    async getProvider() {
        return this._getProvider();
    }
    toJSON() {
        return this._state;
    }
    /**
     * Mounts ethereum based event hooks t the hook router
     * @see https://eips.ethereum.org/EIPS/eip-1193#references for list of ethereum hooks
     */ async mountEventListeners() {
        if (!this.getIsWalletInstalled()) return;
        const ethereum = this._getEthereumProvider();
        const provider = this._getProvider();
        if (!ethereum.on) {
            console.warn("ethereum.on was not found and event listeners could not be mounted. web3-wallet might fall out of sync");
            return;
        }
        ethereum.on("accountsChanged", async (accounts)=>{
            console.log({
                accounts: accounts
            });
            this._state.accounts = accounts;
            console.log({
                accounts: accounts
            });
            if (accounts.length === 0) {
                await this.signOut();
                this.hookRouter.applyHooks([
                    (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
                ]);
            } else {
                console.log("INSIDE");
                this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, accounts);
            }
            this._updateWalletStorageValue();
        });
        ethereum.on("chainChanged", async (chainId)=>{
            this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, chainId);
        });
        ethereum.on("disconnect", async (err)=>{
            console.warn(`BaseEthereum Disconnected. Error:`);
            console.warn(err);
            this.hookRouter.applyHooks([
                (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT
            ]);
        });
        provider.on("block", (block)=>{
            this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK, block);
        });
    }
    async unmountEventListeners() {
        const provider = await this._getProvider();
        provider.removeAllListeners();
    }
}







const $63a99e75275a61fa$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $63a99e75275a61fa$export$2c78a3b4fc11d8fa extends (0, $7bc8826faba50ebf$export$bf6aa8a8e97b6c5f) {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $9ef2866eeb66da86$export$be56259456d697c6).ETHEREUM, (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ETHEREUM_METAMASK);
    name = "METAMASK";
    type = (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_METAMASK;
    constructor(state){
        super();
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$63a99e75275a61fa$var$initialState
        };
        this._setupInitialState();
    }
    _getEthereumProvider() {
        return (0, $d808041ad48ee2f7$export$9e095c387372d0b1).getNamedWindowEthereumObject("MetaMask", (ethereumObject)=>Boolean(ethereumObject.isMetaMask));
    }
    async init() {
        this.provider = await this._getProvider();
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this._state.accounts = await provider.send("eth_requestAccounts", []);
        this._state.isConnected = this._state.accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this._state.accounts);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    getIsWalletInstalled() {
        const ethereumGlobal = (0, $412a545945027ba9$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
        if (!ethereumGlobal) return false;
        if (!ethereumGlobal.provider || !ethereumGlobal.providerMap) return ethereumGlobal.isMetaMask || false;
        return Boolean(ethereumGlobal.providerMap.get("MetaMask"));
    }
}


var $f0d7fae4f7bd47a4$exports = {};


$parcel$exportWildcard($05db05568a951b86$exports, $63a99e75275a61fa$exports);
$parcel$exportWildcard($05db05568a951b86$exports, $f0d7fae4f7bd47a4$exports);


var $85bc198bca370cae$exports = {};

$parcel$export($85bc198bca370cae$exports, "defaultEthereumConfig", () => $85bc198bca370cae$export$6e71d57116cbd2a7);
$parcel$export($85bc198bca370cae$exports, "Ethereum", () => $85bc198bca370cae$export$aa318bacd7f710c5);



var $db6ec753b603cb1b$export$2e2bcd8739ae039 = (0, $826e60e3117e96ce$export$2e2bcd8739ae039);



var $aef456d8013cd8bc$exports = {};
var $e9480eda56db4579$exports = {};

$parcel$export($e9480eda56db4579$exports, "Coinbase", () => $e9480eda56db4579$export$bbf33c97e5e72e4f);








const $e9480eda56db4579$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
const $e9480eda56db4579$var$defaultConfig = Object.freeze({
    coinbaseConfig: {
        appName: "Dapp",
        appLogoUrl: "",
        darkMode: false
    },
    defaultEthJsonRPCUrl: "",
    defaultChainId: 1
});
class $e9480eda56db4579$export$bbf33c97e5e72e4f extends (0, $7bc8826faba50ebf$export$bf6aa8a8e97b6c5f) {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $9ef2866eeb66da86$export$be56259456d697c6).ETHEREUM, (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ETHEREUM_COINBASE);
    chain = null;
    name = "COINBASE";
    type = (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_COINBASE;
    constructor(state, config = $e9480eda56db4579$var$defaultConfig){
        super();
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$e9480eda56db4579$var$initialState
        };
        this._config = config;
        this._wallet = new (0, $hgUW1$coinbasewalletsdk)(config.coinbaseConfig);
        this._setupInitialState();
    }
    _getEthereumProvider() {
        return (0, $d808041ad48ee2f7$export$9e095c387372d0b1).getNamedWindowEthereumObject("CoinbaseWallet", (ethereum)=>Boolean(ethereum.isCoinbaseWallet));
    }
    async init() {
        this.provider = await this._getProvider();
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this._state.accounts = await provider.send("eth_requestAccounts", []);
        this._state.isConnected = this._state.accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this._state.accounts);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    getIsWalletInstalled() {
        const ethereumGlobal = (0, $412a545945027ba9$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
        if (!ethereumGlobal) return false;
        if (!ethereumGlobal.provider || !ethereumGlobal.providerMap) return ethereumGlobal.isCoinbaseWallet || false;
        return Boolean(ethereumGlobal.providerMap.get("Coinbase"));
    }
}


var $fa668c2febda8fb5$exports = {};


$parcel$exportWildcard($aef456d8013cd8bc$exports, $e9480eda56db4579$exports);
$parcel$exportWildcard($aef456d8013cd8bc$exports, $fa668c2febda8fb5$exports);



var $b82f469e02efa91a$exports = {};
var $07e52f3c9fc905f8$exports = {};

$parcel$export($07e52f3c9fc905f8$exports, "EthWalletConnect", () => $07e52f3c9fc905f8$export$9741c3aebc6a0fb7);






const $07e52f3c9fc905f8$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $07e52f3c9fc905f8$export$9741c3aebc6a0fb7 extends (0, $7bc8826faba50ebf$export$bf6aa8a8e97b6c5f) {
    _walletConnectProvider = null;
    type = (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_WALLETCONNECT;
    name = "ETHEREUM_WALLETCONNECT";
    constructor(state){
        super();
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$07e52f3c9fc905f8$var$initialState
        };
        this._setupInitialState();
    }
    _fetchWCProvider() {
        const walletConnectProvider = new (0, $hgUW1$walletconnectweb3provider)({
            infuraId: "f83857b162d64708b25a59585f969fbd",
            qrcode: true
        });
        return walletConnectProvider;
    }
    async _initProvider() {
        this._walletConnectProvider = this._fetchWCProvider();
        await this._walletConnectProvider.enable();
    }
    async _deinitProvider() {
        if (this._walletConnectProvider !== null) await this._walletConnectProvider.disconnect();
        this._walletConnectProvider = null;
    }
    _getProvider() {
        const provider = this.getWCProvider();
        return new (0, $hgUW1$providers).Web3Provider(provider);
    }
    getWCProvider() {
        if (this._walletConnectProvider === null) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
        return this._walletConnectProvider;
    }
    async init() {
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        await this._initProvider();
        const provider = await this._getProvider();
        this._state.accounts = await provider.listAccounts();
        this._state.isConnected = this._state.accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this._state.accounts);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        await this._deinitProvider();
        this._state.accounts = [];
        this._state.isConnected = false;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    getIsWalletInstalled() {
        return true; // mobile wallet so wallet is always connected
    }
    async mountEventListeners() {
        return;
    }
    async unmountEventListeners() {
        return;
    }
}


var $23e6805a38b2b33b$exports = {};


$parcel$exportWildcard($b82f469e02efa91a$exports, $07e52f3c9fc905f8$exports);
$parcel$exportWildcard($b82f469e02efa91a$exports, $23e6805a38b2b33b$exports);


/**
 * Available Ethereum Wallets
 */ const $85bc198bca370cae$var$walletTypes = [
    (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_METAMASK,
    (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_WALLETCONNECT,
    (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_COINBASE
];
/**
 * Default config
 */ const $85bc198bca370cae$export$6e71d57116cbd2a7 = {
    hookType: "active",
    defaultWallet: (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_METAMASK
};
/***
 * Ethereum Chain Wallet used to manage ethereum wallets and invoke ethereum transactions
 */ class $85bc198bca370cae$export$aa318bacd7f710c5 {
    hookRouter = new (0, $db6ec753b603cb1b$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _initialized = false;
    _activeWallets = [];
    type = (0, $9ef2866eeb66da86$export$be56259456d697c6).ETHEREUM;
    name = "ETHEREUM";
    /**
     * Constructor for Ethereum
     * @param config - Partial Ethereum Config to be overwritten with defaults
     * @param data - Ethereum Data to initialize with
     */ constructor(config, data){
        this._metaMask = new (0, $63a99e75275a61fa$export$2c78a3b4fc11d8fa)(data?.metaMask);
        this._walletConnect = new (0, $07e52f3c9fc905f8$export$9741c3aebc6a0fb7)(data?.walletConnect);
        this._coinbase = new (0, $e9480eda56db4579$export$bbf33c97e5e72e4f)(data?.coinbase);
        this._config = {
            ...$85bc198bca370cae$export$6e71d57116cbd2a7,
            ...config
        };
    }
    /**
     * Mount internal hooks that make managing active wallet possible
     * @param wallet - wallet type
     */ _mountInternalHooks = (wallet)=>{
        const verifyWallet = (walletType)=>{
            switch(this._config.hookType){
                case "active":
                    return this._activeWallets[0] === walletType;
                case "all":
                    return true;
                default:
                    return false;
            }
        };
        const hook = (hookType)=>(...args)=>{
                if (!verifyWallet(wallet.type)) return;
                this.hookRouter.applyHookWithArgs(hookType, ...[
                    wallet.type,
                    ...args
                ]);
            };
        const onAccountChange = (accounts)=>{
            if (accounts.length < 1) this._deregisterActiveWallet(wallet.type);
            else this._registerActiveWallet(wallet.type);
        };
        const onAccountDisconnect = ()=>{
            this._deregisterActiveWallet(wallet.type);
        };
        wallet.onAccountChange(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE));
        wallet.onAccountDisconnect(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT));
        wallet.onChainChange(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE));
        wallet.onChainDisconnect(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT));
        wallet.onAccountChange(onAccountChange);
        wallet.onAccountDisconnect(onAccountDisconnect);
        // onBlockAdded is a chain and not a wallet specific event
        // so wallet type is not required
        if (wallet.type === this._config.defaultWallet) wallet.onBlockAdded((newBlock)=>{
            this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK, [
                newBlock
            ]);
        });
    };
    /**
     * Register a wallet as active
     * @param type - Wallet type
     */ _registerActiveWallet = (type)=>{
        this._activeWallets.unshift(type);
    };
    /**
     * Deregister a new wallet from active
     * @param type - Wallet type
     */ _deregisterActiveWallet = (type)=>{
        const index = this._activeWallets.indexOf(type);
        this._activeWallets = this._activeWallets.splice(index, 1);
    };
    /**
     * Internally initialize wallet
     * @param algoWallet - wallet
     */ _initEthereumWallet = async (wallet)=>{
        if (wallet.getIsWalletInstalled()) {
            await wallet.init();
            await wallet.mountEventListeners();
            await this._mountInternalHooks(wallet);
        } else console.warn(`${wallet.name} is not currently installed...`);
    };
    /**
     * Initializes the chain wallet
     * @returns wallet status
     * @remarks Should be called separately from constructor
     */ async init() {
        if (this._initialized) return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
        await Promise.all([
            this._metaMask,
            this._walletConnect,
            this._coinbase
        ].map(this._initEthereumWallet));
        this._initialized = true;
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    getWallet(type) {
        switch(type){
            case (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_WALLETCONNECT:
                return this._walletConnect;
            case (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_METAMASK:
                return this._metaMask;
            case (0, $9ef2866eeb66da86$export$353aefc175350117).ETHEREUM_COINBASE:
                return this._coinbase;
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }
    getAvailableWallets() {
        return $85bc198bca370cae$var$walletTypes.filter((walletType)=>this.getWallet(walletType).getIsWalletInstalled());
    }
    getConnectedWallets() {
        return $85bc198bca370cae$var$walletTypes.filter((walletType)=>this.getWallet(walletType).getIsConnected());
    }
    getActiveWallet() {
        if (this._activeWallets.length === 0) return this.getWallet(this._config.defaultWallet); // Get default wallet
        return this.getWallet(this._activeWallets[0]);
    }
    updateActiveWallet(type) {
        this._registerActiveWallet(type);
        return this.getWallet(type);
    }
    signIn() {
        return this.getActiveWallet().signIn();
    }
    signOut() {
        return this.getActiveWallet().signOut();
    }
    getSigner() {
        return this.getActiveWallet().getSigner();
    }
    getBalance() {
        return this.getActiveWallet().getBalance();
    }
    getProvider() {
        return this.getActiveWallet().getProvider();
    }
    getIsConnected() {
        return this.getActiveWallet().getIsConnected();
    }
    getIsWalletInstalled() {
        return this.getActiveWallet().getIsWalletInstalled();
    }
    getPrimaryAccount() {
        return this.getActiveWallet().getPrimaryAccount();
    }
    getAccounts() {
        return this.getActiveWallet().getAccounts();
    }
    fetchCurrentChainID() {
        return this.getActiveWallet().fetchCurrentChainID();
    }
    mountEventListeners() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    };
    onBlockAdded = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK, (block)=>{
            return cb(block);
        });
    };
    toJSON() {
        return [
            {
                type: this._metaMask.type,
                name: this._metaMask.name,
                state: this._metaMask.toJSON()
            },
            {
                type: this._walletConnect.type,
                name: this._walletConnect.name,
                state: this._walletConnect.toJSON()
            },
            {
                type: this._coinbase.type,
                name: this._coinbase.name,
                state: this._coinbase.toJSON()
            }
        ];
    }
}




var $a834aca09c16c000$exports = {};


$parcel$exportWildcard($61dc865ce14f4bf4$exports, $05db05568a951b86$exports);
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $85bc198bca370cae$exports);
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $b82f469e02efa91a$exports);
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $a834aca09c16c000$exports);
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $aef456d8013cd8bc$exports);


var $dc4d60a7eb431eef$exports = {};
var $0e4707f80e4e0187$exports = {};
var $8f12a92ca31811ed$exports = {};

$parcel$export($8f12a92ca31811ed$exports, "MyAlgo", () => $8f12a92ca31811ed$export$6ab354d5c56bf95);






const $8f12a92ca31811ed$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $8f12a92ca31811ed$export$6ab354d5c56bf95 {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE
    ]);
    walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND, (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ALGORAND_MYALGO);
    currentActiveAccountAddress = "";
    type = (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_MYALGO;
    name = "ALGORAND_MYALGO";
    constructor(state){
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$8f12a92ca31811ed$var$initialState
        };
        this.setupInitialState();
    }
    enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
    }
    async init() {
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    getProvider() {
        if (this.provider instanceof (0, $hgUW1$randlabsmyalgoconnect)) return this.provider;
        this.provider = new (0, $hgUW1$randlabsmyalgoconnect)();
        return this.provider;
    }
    switchAccount(address) {
        const account = this._state.accounts.find((acc)=>acc.address === address);
        if (account) this.currentActiveAccountAddress = account.address;
        this.updateWalletStorageValue();
    }
    setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) {
            this._state = {
                isConnected: storageValue.isConnected,
                accounts: storageValue.accounts ? storageValue.accounts.map((address)=>({
                        name: "",
                        address: address
                    })) : []
            };
            this.currentActiveAccountAddress = storageValue.connectedAccount;
        }
    }
    updateWalletStorageValue() {
        if (this._state.isConnected && this._state.accounts.length > 0) {
            const accounts = this.getAccounts().map((acc)=>acc.address);
            const connectedAccount = this.getPrimaryAccount().address;
            this.walletStorage.updateValue(true, connectedAccount, accounts);
        } else this.walletStorage.updateValue(false, "", []);
    }
    async signIn() {
        const myAlgoConnect = this.getProvider();
        // forces user to only choose one account.
        // This prevents a lot of edge cases.
        this._state.accounts = await myAlgoConnect.connect();
        this._state.isConnected = this._state.accounts.length > 0;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this.enforceIsConnected();
            const myAlgoConnect = this.getProvider();
            const signedTx = await myAlgoConnect.signTransaction(transactions);
            return signedTx;
        };
    }
    async getBalance() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    getIsWalletInstalled() {
        return true; // wallet is web only so is always installed
    }
    getIsConnected() {
        return this._state.isConnected;
    }
    getPrimaryAccount() {
        if (!this.getIsConnected()) return {
            name: "",
            address: ""
        };
        const account = this._state.accounts.find((acc)=>acc.address === this.currentActiveAccountAddress);
        if (this.currentActiveAccountAddress && account) return account;
        return this._state.accounts[0];
    }
    getAccounts() {
        return this._state.accounts;
    }
    async fetchCurrentChainID() {
        return "0x1";
    }
    async mountEventListeners() {
        return;
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getAccounts());
        });
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, ()=>{
            return cb();
        });
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    };
    toJSON() {
        return this._state;
    }
    /**
     * DANGER - REFRAIN from using in production as can have some unintended side effect. NOT FULLY SUPPORTED!
     * @param data - New State for wallet
     */ _dangerouslyUpdateInternalState(data) {
        console.warn(`WARNING - You are about to update the internal state for ${this.name}!! Functionality may not work correctly...`);
        this._state = data;
    }
}


var $38642dfdba4f278f$exports = {};


$parcel$exportWildcard($0e4707f80e4e0187$exports, $8f12a92ca31811ed$exports);
$parcel$exportWildcard($0e4707f80e4e0187$exports, $38642dfdba4f278f$exports);


var $b5af4601982a5fe5$exports = {};

$parcel$export($b5af4601982a5fe5$exports, "defaultAlgorandConfig", () => $b5af4601982a5fe5$export$24f2ad57db25a90c);
$parcel$export($b5af4601982a5fe5$exports, "Algorand", () => $b5af4601982a5fe5$export$2a2454b5976b73ac);





var $b5560c6a127e9264$exports = {};
var $95e4ef1726fa05c6$exports = {};

$parcel$export($95e4ef1726fa05c6$exports, "PeraWallet", () => $95e4ef1726fa05c6$export$6a733d504587e4b0);








var $95e4ef1726fa05c6$require$Buffer = $hgUW1$Buffer;
const $95e4ef1726fa05c6$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $95e4ef1726fa05c6$export$6a733d504587e4b0 {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE
    ]);
    walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND, (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ALGORAND_PERAWALLET);
    type = (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_PERAWALLET;
    name = "ALGORAND_PERAWALLET";
    constructor(state){
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$95e4ef1726fa05c6$var$initialState
        };
        this._setupInitialState();
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
    }
    _setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this._state = {
            isConnected: this.getIsConnected(),
            accounts: storageValue.accounts.map((account)=>({
                    name: "",
                    address: account
                }))
        };
    }
    _updateWalletStorageValue() {
        if (this._state.isConnected && this._state.accounts.length > 0) {
            const accounts = this.getAccounts().map((acc)=>acc.address);
            const connectedAccount = this.getPrimaryAccount().address;
            this.walletStorage.updateValue(true, connectedAccount, accounts);
        } else this.walletStorage.updateValue(false, "", []);
    }
    async init() {
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        this.provider = this.getProvider();
        const accounts = await this.provider.connect();
        this._state.accounts = accounts.map((account)=>({
                name: "",
                address: account
            }));
        this._state.isConnected = Array.isArray(accounts) && accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        this.provider?.connector?.on("disconnect", (error, _payload)=>{
            if (error) throw error;
            this.signOut();
        });
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._state.accounts = [];
        this._state.isConnected = false;
        if (!this.provider) this.provider = this.getProvider();
        if (!this.provider.connector) await this.provider.reconnectSession();
        try {
            await this.provider?.disconnect();
        } catch (e) {
            console.error("Failed to kill session...");
        }
        this.provider = undefined;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this._enforceIsConnected();
            const peraWallet = this.getProvider();
            if (!peraWallet.connector) await peraWallet.reconnectSession();
            const txnsToSign = transactions.map((txn)=>({
                    txn: $95e4ef1726fa05c6$require$Buffer.from(txn).toString("base64")
                }));
            const jsonRpcRequest = (0, $hgUW1$formatJsonRpcRequest)("algo_signTxn", [
                txnsToSign
            ]);
            const signedTxns = await peraWallet?.connector?.sendCustomRequest(jsonRpcRequest);
            const signedTxns2 = [];
            for(let i = 0; i < signedTxns.length; i++)if (signedTxns[i] !== null) signedTxns2.push({
                txID: "",
                blob: new Uint8Array($95e4ef1726fa05c6$require$Buffer.from(signedTxns[i], "base64"))
            });
            else signedTxns2.push({
                txID: "",
                // make linter happy although this was intentional
                blob: null
            });
            return signedTxns2;
        };
    }
    async getBalance() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    getIsWalletInstalled() {
        return true; // wallet is web only so is always installed
    }
    getIsConnected() {
        return Boolean(this.getAccounts().length);
    }
    getPrimaryAccount() {
        return this._state.accounts[0];
    }
    getAccounts() {
        return Array.isArray(this._state.accounts) ? this._state.accounts : [];
    }
    async fetchCurrentChainID() {
        return "0x1";
    }
    async mountEventListeners() {
        return;
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getAccounts());
        });
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, ()=>{
            return cb();
        });
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    };
    toJSON() {
        return this._state;
    }
    /**
     * DANGER - REFRAIN from using in production as can have some unintended side effect. NOT FULLY SUPPORTED!
     * @param data - New State for wallet
     */ _dangerouslyUpdateInternalState(data) {
        console.warn(`WARNING - You are about to update the internal state for ${this.name}!! Functionality may not work correctly...`);
        this._state = data;
    }
    getProvider() {
        this._enforceIsConnected();
        if (this.provider instanceof (0, $hgUW1$PeraWalletConnect)) return this.provider;
        this.provider = new (0, $hgUW1$PeraWalletConnect)();
        return this.provider;
    }
}


var $ce3015d7053c99e0$exports = {};


$parcel$exportWildcard($b5560c6a127e9264$exports, $95e4ef1726fa05c6$exports);
$parcel$exportWildcard($b5560c6a127e9264$exports, $ce3015d7053c99e0$exports);


var $6a9b0d356171a818$exports = {};
var $42024282ef82c6ee$exports = {};

$parcel$export($42024282ef82c6ee$exports, "WalletConnect", () => $42024282ef82c6ee$export$ba0ef3a0d99fcc8f);









var $42024282ef82c6ee$require$Buffer = $hgUW1$Buffer;
const $42024282ef82c6ee$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $42024282ef82c6ee$export$ba0ef3a0d99fcc8f {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE
    ]);
    walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND, (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ALGORAND_WALLETCONNECT);
    type = (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_WALLETCONNECT;
    name = "ALGORAND_WALLETCONNECT";
    constructor(state){
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$42024282ef82c6ee$var$initialState
        };
        this._setupInitialState();
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
    }
    _setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this._state = {
            isConnected: this.getIsConnected(),
            accounts: storageValue.accounts
        };
    }
    _updateWalletStorageValue() {
        if (this._state.isConnected && this._state.accounts.length > 0) {
            const accounts = this.getAccounts().map((acc)=>acc.address);
            const connectedAccount = this.getPrimaryAccount().address;
            this.walletStorage.updateValue(true, connectedAccount, accounts);
        } else this.walletStorage.updateValue(false, "", []);
    }
    async init() {
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        this.provider = new (0, $hgUW1$walletconnectclient)({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: (0, $hgUW1$algorandwalletconnectqrcodemodal)
        });
        if (!this.provider.connected) // create new session
        await this.provider.createSession();
        else {
            const { accounts: accounts  } = this.provider;
            this._state.isConnected = Array.isArray(accounts) && accounts.length > 0;
            this._state.accounts = accounts;
            this._updateWalletStorageValue();
            this.hookRouter.applyHooks([
                (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
            ]);
        }
        this.provider.on("connect", (error, payload)=>{
            if (error) throw error;
            // Get provided accounts
            const { accounts: accounts  } = payload.params[0];
            this._state.isConnected = Array.isArray(accounts) && accounts.length > 0;
            this._state.accounts = accounts;
            this._updateWalletStorageValue();
            this.hookRouter.applyHooks([
                (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
            ]);
        });
        this.provider.on("disconnect", (error, _payload)=>{
            if (error) throw error;
            this.signOut();
        });
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._state.accounts = [];
        this._state.isConnected = false;
        if (!this.provider) this.getProvider();
        try {
            await this.provider?.killSession();
        } catch (e) {
            console.error("Failed to kill session...");
        }
        this.provider = undefined;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this._enforceIsConnected();
            const walletConnect = this.getProvider();
            const txnsToSign = transactions.map((txn)=>({
                    txn: $42024282ef82c6ee$require$Buffer.from(txn).toString("base64")
                }));
            const jsonRpcRequest = (0, $hgUW1$formatJsonRpcRequest)("algo_signTxn", [
                txnsToSign
            ]);
            const signedTxns = await walletConnect.sendCustomRequest(jsonRpcRequest);
            const signedTxns2 = [];
            for(let i = 0; i < signedTxns.length; i++)if (signedTxns[i] !== null) signedTxns2.push({
                txID: "",
                blob: new Uint8Array($42024282ef82c6ee$require$Buffer.from(signedTxns[i], "base64"))
            });
            else signedTxns2.push({
                txID: "",
                blob: null
            });
            return signedTxns2;
        };
    }
    async getBalance() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    getIsWalletInstalled() {
        return true; // wallet is web only so is always installed
    }
    getIsConnected() {
        const provider = this.getProvider();
        return provider.connected;
    }
    getPrimaryAccount() {
        return {
            address: this._state.accounts[0],
            name: ""
        };
    }
    getAccounts() {
        return this._state.accounts.map((ob)=>({
                address: ob,
                name: ""
            }));
    }
    async fetchCurrentChainID() {
        return "0x1";
    }
    async mountEventListeners() {
        return;
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getAccounts());
        });
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, ()=>{
            return cb();
        });
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    };
    toJSON() {
        return this._state;
    }
    /**
     * DANGER - REFRAIN from using in production as can have some unintended side effect. NOT FULLY SUPPORTED!
     * @param data - New State for wallet
     */ _dangerouslyUpdateInternalState(data) {
        console.warn(`WARNING - You are about to update the internal state for ${this.name}!! Functionality may not work correctly...`);
        this._state = data;
    }
    getProvider() {
        if (this.provider instanceof (0, $hgUW1$walletconnectclient)) return this.provider;
        this.provider = new (0, $hgUW1$walletconnectclient)({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: (0, $hgUW1$algorandwalletconnectqrcodemodal)
        });
        return this.provider;
    }
}


var $3a36ecaae881d84d$exports = {};


$parcel$exportWildcard($6a9b0d356171a818$exports, $42024282ef82c6ee$exports);
$parcel$exportWildcard($6a9b0d356171a818$exports, $3a36ecaae881d84d$exports);


/**
 * Default config
 */ const $b5af4601982a5fe5$export$24f2ad57db25a90c = {
    hookType: "active",
    defaultWallet: (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_MYALGO
};
/***
 * Algorand Chain Wallet used to manage algorand wallets and invoke algorand transactions
 */ class $b5af4601982a5fe5$export$2a2454b5976b73ac {
    hookRouter = new (0, $db6ec753b603cb1b$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _initialized = false;
    _activeWallets = [];
    type = (0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND;
    name = "ALGORAND";
    /**
     * Constructor for Algorand
     * @param config - Partial Algorand Config to be overwritten with defaults
     * @param data - Algorand Data to initialize with
     */ constructor(config, data){
        this._myAlgo = new (0, $8f12a92ca31811ed$export$6ab354d5c56bf95)(data?.myAlgo);
        this._walletConnect = new (0, $42024282ef82c6ee$export$ba0ef3a0d99fcc8f)(data?.walletConnect);
        this._peraWallet = new (0, $95e4ef1726fa05c6$export$6a733d504587e4b0)(data?.peraWallet);
        this._config = {
            ...$b5af4601982a5fe5$export$24f2ad57db25a90c,
            ...config
        };
    }
    /**
     * Register a wallet as active
     * @param type - Wallet type
     */ _registerActiveWallet = (type)=>{
        this._activeWallets.unshift(type);
    };
    /**
     * Deregister a new wallet from active
     * @param type - Wallet type
     */ _deregisterActiveWallet = (type)=>{
        this._activeWallets = this._activeWallets.filter((elem)=>elem !== type);
    };
    /**
     * Mount internal hooks that make managing active wallet possible
     * @param wallet - wallet type
     */ _mountInternalHooks = (wallet)=>{
        const verifyWallet = (walletType)=>{
            switch(this._config.hookType){
                case "active":
                    return this._activeWallets[0] === walletType;
                case "all":
                    return true;
                default:
                    return false;
            }
        };
        const hook = (hookType)=>(...args)=>{
                if (!verifyWallet(wallet.type)) return;
                this.hookRouter.applyHookWithArgs(hookType, ...[
                    wallet.type,
                    ...args
                ]);
            };
        const onAccountChange = (accounts)=>{
            if (accounts.length < 1) this._deregisterActiveWallet(wallet.type);
            else this._registerActiveWallet(wallet.type);
        };
        const onAccountDisconnect = ()=>{
            this._deregisterActiveWallet(wallet.type);
        };
        wallet.onAccountChange(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE));
        wallet.onAccountDisconnect(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT));
        wallet.onChainChange(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE));
        wallet.onAccountChange(onAccountChange);
        wallet.onAccountDisconnect(onAccountDisconnect);
    };
    /**
     * Internally initialize wallet
     * @param algoWallet - wallet
     */ _initAlgorandWallet = async (algoWallet)=>{
        if (algoWallet.getIsWalletInstalled()) {
            await algoWallet.init();
            await this._mountInternalHooks(algoWallet);
        } else console.warn("Selected algorand wallet is not currently installed...");
    };
    /**
     * Initializes the chain wallet
     * @returns wallet status
     * @remarks Should be called separately from constructor
     */ async init() {
        if (this._initialized) return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
        this._initialized = true;
        await Promise.all([
            this._myAlgo,
            this._walletConnect,
            this._peraWallet
        ].map(this._initAlgorandWallet));
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    getWallet(type) {
        switch(type){
            case (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_MYALGO:
                return this._myAlgo;
            case (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_WALLETCONNECT:
                return this._walletConnect;
            case (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_PERAWALLET:
                return this._peraWallet;
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }
    getAvailableWallets() {
        const walletTypes = [
            (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_MYALGO,
            (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_PERAWALLET,
            (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_WALLETCONNECT
        ];
        return walletTypes.filter((walletType)=>this.getWallet(walletType).getIsWalletInstalled());
    }
    getConnectedWallets() {
        const walletTypes = [
            (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_MYALGO,
            (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_PERAWALLET,
            (0, $9ef2866eeb66da86$export$353aefc175350117).ALGORAND_WALLETCONNECT
        ];
        return walletTypes.filter((walletType)=>this.getWallet(walletType).getIsConnected());
    }
    getActiveWallet() {
        if (this._activeWallets.length === 0) return this.getWallet(this._config.defaultWallet); // Get default wallet
        return this.getWallet(this._activeWallets[0]);
    }
    updateActiveWallet(type) {
        this._registerActiveWallet(type);
        return this.getWallet(type);
    }
    signIn() {
        return this.getActiveWallet().signIn();
    }
    signOut() {
        return this.getActiveWallet().signOut();
    }
    getSigner() {
        return this.getActiveWallet().getSigner();
    }
    getBalance() {
        return this.getActiveWallet().getBalance();
    }
    getProvider() {
        return this.getActiveWallet().getProvider();
    }
    getIsConnected() {
        return this.getActiveWallet().getIsConnected();
    }
    getIsWalletInstalled() {
        return this.getActiveWallet().getIsWalletInstalled();
    }
    getPrimaryAccount() {
        return this.getActiveWallet().getPrimaryAccount();
    }
    getAccounts() {
        return this.getActiveWallet().getAccounts();
    }
    fetchCurrentChainID() {
        return this.getActiveWallet().fetchCurrentChainID();
    }
    mountEventListeners() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    };
    toJSON() {
        return [
            {
                type: this._myAlgo.type,
                name: this._myAlgo.name,
                state: this._myAlgo.toJSON()
            },
            {
                type: this._walletConnect.type,
                name: this._walletConnect.name,
                state: this._walletConnect.toJSON()
            },
            {
                type: this._peraWallet.type,
                name: this._peraWallet.name,
                state: this._peraWallet.toJSON()
            }
        ];
    }
}




var $a590315aa4ce5581$exports = {};


$parcel$exportWildcard($dc4d60a7eb431eef$exports, $0e4707f80e4e0187$exports);
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $b5af4601982a5fe5$exports);
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $6a9b0d356171a818$exports);
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $b5560c6a127e9264$exports);
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $a590315aa4ce5581$exports);




var $24e5985ce7e733e8$exports = {};

$parcel$export($24e5985ce7e733e8$exports, "SuperWallet", () => $24e5985ce7e733e8$export$f5a985e9820441e);






/**
 * Super Wallet Class. One Wallet to rule them all
 * Manages Chain + Wallet and allows you to seamlessly switch between using one interface
 */ class $24e5985ce7e733e8$export$f5a985e9820441e {
    hookRouter = new (0, $db6ec753b603cb1b$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _initialized = false;
    _activeChain = [];
    constructor(config, data){
        this._config = config;
        let algorandConfig = (0, $b5af4601982a5fe5$export$24f2ad57db25a90c);
        let ethereumConfig = (0, $85bc198bca370cae$export$6e71d57116cbd2a7);
        const algorandState = data?.algorand;
        const ethereumState = data?.ethereum;
        this._config.chains.map((chain)=>{
            if (chain.type === (0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND) algorandConfig = {
                ...algorandConfig,
                ...chain.config
            };
            if (chain.type === (0, $9ef2866eeb66da86$export$be56259456d697c6).ETHEREUM) ethereumConfig = {
                ...ethereumConfig,
                ...chain.config
            };
        });
        this._algorand = new (0, $b5af4601982a5fe5$export$2a2454b5976b73ac)(algorandConfig, algorandState);
        this._ethereum = new (0, $85bc198bca370cae$export$aa318bacd7f710c5)(ethereumConfig, ethereumState);
    }
    /**
     * Register a wallet as active
     * @param type - Wallet type
     */ _registerActiveChain = (type)=>{
        this._activeChain.unshift(type);
    };
    /**
     * Deregister a new wallet from active
     * @param type - Wallet type
     */ _deregisterActiveChain = (type)=>{
        this._activeChain = this._activeChain.filter((elem)=>elem !== type);
    };
    /**
     * Mount internal hooks that make managing active wallet possible
     * @param wallet - wallet type
     */ _mountInternalHooks = (chain)=>{
        const hook = (hookType)=>(...args)=>{
                this.hookRouter.applyHookWithArgs(hookType, ...[
                    chain,
                    ...args
                ]);
            };
        const onAccountChange = (accounts)=>{
            if (accounts.length < 1) this._deregisterActiveChain(chain.type);
            else this._registerActiveChain(chain.type);
        };
        const onAccountDisconnect = ()=>{
            this._deregisterActiveChain(chain.type);
        };
        chain.onAccountChange(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE));
        chain.onAccountDisconnect(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT));
        chain.onChainChange(hook((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE));
        chain.onAccountChange((_wallet, accounts)=>onAccountChange(accounts));
        chain.onAccountDisconnect((_wallet)=>onAccountDisconnect());
    };
    /**
     * Initializes the chain wallet
     * @param chain - chain to initialize
     */ _initSuperWalletChain = async (chain)=>{
        await chain.init();
        await this._mountInternalHooks(chain);
    };
    /**
     * higher level function that wraps around functions
     * that take a chain as an argument and applies function to all chains
     * @param method - function to invoke
     * @returns function return value
     */ _applyAllChains = (method)=>{
        const CHAIN_TYPES = [
            (0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND,
            (0, $9ef2866eeb66da86$export$be56259456d697c6).ETHEREUM
        ];
        let result = [];
        CHAIN_TYPES.forEach((chainType)=>{
            result = [
                ...result,
                ...method(chainType)
            ];
        });
        return result;
    };
    /**
     * Initializes the chain wallet
     * @returns wallet status
     * @remarks Should be called separately from constructor
     */ async init() {
        if (this._initialized) return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
        this._initialized = true;
        await Promise.all([
            this._algorand,
            this._ethereum
        ].map(this._initSuperWalletChain));
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    /**
     * Get Chain
     * @param type - chain type
     * @returns chain interface
     */ getChain(type) {
        switch(type){
            case (0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND:
                return this._algorand;
            case (0, $9ef2866eeb66da86$export$be56259456d697c6).ETHEREUM:
                return this._ethereum;
            default:
                throw new Error(`Chain type ${type} cannot be found`);
        }
    }
    /**
     * Get wallet from chain
     * @param chainType - chain type
     * @param walletType - wallet type
     * @returns specific wallet
     */ getWallet(chainType, walletType) {
        const chain = this.getChain(chainType);
        if (chain instanceof (0, $b5af4601982a5fe5$export$2a2454b5976b73ac)) return chain.getWallet(walletType);
        return chain.getWallet(walletType);
    }
    /**
     * Get all available wallet from chain
     * @param chainType - chain type
     * @returns all available wallets on chain
     */ getAvailableWalletsOnChain(chainType) {
        if (chainType === (0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND) return this._algorand.getAvailableWallets();
        return this._ethereum.getAvailableWallets();
    }
    /**
     * Get all available wallet
     * @returns all available wallets on any chain
     */ getAvailableWallets() {
        return this._applyAllChains(this.getAvailableWalletsOnChain);
    }
    /**
     * Get all connected wallet from chain
     * @param chainType - chain type
     * @returns all connected wallets on chain
     */ getConnectedWalletsOnChain(chainType) {
        if (chainType === (0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND) return this._algorand.getConnectedWallets();
        return this._ethereum.getConnectedWallets();
    }
    /**
     * Get all available wallet
     * @returns all connected wallets on any chain
     */ getConnectedWallets() {
        return this._applyAllChains(this.getConnectedWalletsOnChain);
    }
    /**
     * Get active wallet from chain
     * @param chainType - chain type
     * @returns active wallet on chain
     */ getActiveChain() {
        if (this._activeChain.length === 0) return this.getChain(this._config.defaultChain); // Get default wallet
        return this.getChain(this._activeChain[0]);
    }
    /**
     * Get all active wallets on any chain
     * @returns all active wallets on any chain
     */ getActiveWalletOnChain(chainType) {
        if (chainType === (0, $9ef2866eeb66da86$export$be56259456d697c6).ALGORAND) return this._algorand.getActiveWallet();
        return this._ethereum.getActiveWallet();
    }
    /**
     * Get the last used wallet on the last used chain
     * @returns the last used wallet on the last used chain
     */ getActiveWallet() {
        const chain = this.getActiveChain();
        return chain.getActiveWallet();
    }
    /**
     * Update the active chain with chain
     * @param chainType - chain to become active
     * @returns the chain wallet
     */ updateActiveChain(chainType) {
        this._registerActiveChain(chainType);
        return this.getChain(chainType);
    }
    /**
     * Update the active wallet on chain
     * @param chainType - chain to select wallet
     * @param walletType - wallet to become active on chain
     * @returns the active wallet
     */ updateActiveWalletOnChain(chainType, walletType) {
        const chain = this.getChain(chainType);
        if (chain instanceof (0, $b5af4601982a5fe5$export$2a2454b5976b73ac)) return chain.updateActiveWallet(walletType);
        return chain.updateActiveWallet(walletType);
    }
    signIn() {
        return this.getActiveWallet().signIn();
    }
    signOut() {
        return this.getActiveWallet().signOut();
    }
    getSigner() {
        return this.getActiveWallet().getSigner();
    }
    getBalance() {
        return this.getActiveWallet().getBalance();
    }
    getAssets() {
        return this.getActiveWallet().getAssets();
    }
    getProvider() {
        return this.getActiveWallet().getProvider();
    }
    getIsConnected() {
        return this.getActiveWallet().getIsConnected();
    }
    getIsWalletInstalled() {
        return this.getActiveWallet().getIsWalletInstalled();
    }
    getPrimaryAccount() {
        return this.getActiveWallet().getPrimaryAccount();
    }
    getAccounts() {
        return this.getActiveWallet().getAccounts();
    }
    fetchCurrentChainID() {
        return this.getActiveWallet().fetchCurrentChainID();
    }
    mountEventListeners() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    };
    toJSON() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
}





export {$28ac839a9eca26f5$export$e162153238934121 as NotImplementedError, $28ac839a9eca26f5$export$72563c16b91dfd16 as WalletNotInstalledError, $28ac839a9eca26f5$export$313d299817c74896 as WalletNotConnectedError, $28ac839a9eca26f5$export$f4d277c155d1965e as HookNotAvailableError, $63a99e75275a61fa$export$2c78a3b4fc11d8fa as Metamask, $85bc198bca370cae$export$6e71d57116cbd2a7 as defaultEthereumConfig, $85bc198bca370cae$export$aa318bacd7f710c5 as Ethereum, $07e52f3c9fc905f8$export$9741c3aebc6a0fb7 as EthWalletConnect, $e9480eda56db4579$export$bbf33c97e5e72e4f as Coinbase, $8f12a92ca31811ed$export$6ab354d5c56bf95 as MyAlgo, $b5af4601982a5fe5$export$24f2ad57db25a90c as defaultAlgorandConfig, $b5af4601982a5fe5$export$2a2454b5976b73ac as Algorand, $42024282ef82c6ee$export$ba0ef3a0d99fcc8f as WalletConnect, $95e4ef1726fa05c6$export$6a733d504587e4b0 as PeraWallet, $412a545945027ba9$export$24b8fbafc4b6a151 as useWindow, $9ef2866eeb66da86$export$353aefc175350117 as WALLET_TYPE, $9ef2866eeb66da86$export$be56259456d697c6 as CHAIN_TYPE, $24e5985ce7e733e8$export$f5a985e9820441e as SuperWallet};
//# sourceMappingURL=module.js.map
