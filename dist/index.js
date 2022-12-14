var $8zHUo$algosdk = require("algosdk");
var $8zHUo$etherslibutils = require("ethers/lib/utils");
var $8zHUo$ethers = require("ethers");
var $8zHUo$coinbasewalletsdk = require("@coinbase/wallet-sdk");
var $8zHUo$walletconnectweb3provider = require("@walletconnect/web3-provider");
var $8zHUo$randlabsmyalgoconnect = require("@randlabs/myalgo-connect");
var $8zHUo$jsonrpctoolsutils = require("@json-rpc-tools/utils");
var $8zHUo$perawalletconnect = require("@perawallet/connect");
var $8zHUo$buffer = require("buffer");
var $8zHUo$walletconnectclient = require("@walletconnect/client");
var $8zHUo$algorandwalletconnectqrcodemodal = require("algorand-walletconnect-qrcode-modal");

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
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $faefaad95e5fcca0$exports = {};


var $d083fd37dae77b99$exports = {};

$parcel$export($d083fd37dae77b99$exports, "NotImplementedError", () => $d083fd37dae77b99$export$e162153238934121);
$parcel$export($d083fd37dae77b99$exports, "WalletNotInstalledError", () => $d083fd37dae77b99$export$72563c16b91dfd16);
$parcel$export($d083fd37dae77b99$exports, "WalletNotConnectedError", () => $d083fd37dae77b99$export$313d299817c74896);
$parcel$export($d083fd37dae77b99$exports, "HookNotAvailableError", () => $d083fd37dae77b99$export$f4d277c155d1965e);
/**
 * Method or function is not implemented
 */ class $d083fd37dae77b99$export$e162153238934121 extends Error {
    constructor(message = "NotImplementedError"){
        super(message);
        this.name = "NotImplementedError";
    }
}
/**
 * Wallet method was invoked although wallet was not installed
 */ class $d083fd37dae77b99$export$72563c16b91dfd16 extends Error {
    constructor(message = "WalletNotInstalledError"){
        super(message);
        this.name = "WalletNotInstalledError";
    }
}
/**
 * Wallet method was invoked although wallet was not connected
 */ class $d083fd37dae77b99$export$313d299817c74896 extends Error {
    constructor(message = "WalletNotConnectedError"){
        super(message);
        this.name = "WalletNotConnectedError";
    }
}
/**
 * Hook was registered with an event that is not supported
 */ class $d083fd37dae77b99$export$f4d277c155d1965e extends Error {
    constructor(message = "HookNotAvailableError"){
        super(message);
        this.name = "HookNotAvailableError";
    }
}


var $be737fe08c02d508$exports = {};
var $2b09ea9ee8d63ad1$exports = {};
var $bde3ffd6d211cef9$exports = {};

$parcel$export($bde3ffd6d211cef9$exports, "Metamask", () => $bde3ffd6d211cef9$export$2c78a3b4fc11d8fa);

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
 */ class $a71b91c4d64511bd$export$3e7b7dba1fab7538 {
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
        if (!this.hooks.has(hook)) throw new (0, $d083fd37dae77b99$export$f4d277c155d1965e)();
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
var $a71b91c4d64511bd$export$2e2bcd8739ae039 = $a71b91c4d64511bd$export$3e7b7dba1fab7538;


let /**
 * Wallet statuses
 */ $57b8a5d2d8300786$export$de76a1f31766a0a2;
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
})($57b8a5d2d8300786$export$de76a1f31766a0a2 || ($57b8a5d2d8300786$export$de76a1f31766a0a2 = {}));
let /**
 * Identifier for Wallet
 * @remarks example Metamask, WalletConnect, etc...
 */ $57b8a5d2d8300786$export$7c460c214963f696;
(function(WALLET_ID) {
    WALLET_ID[WALLET_ID["ETHEREUM_NOWALLET"] = 0] = "ETHEREUM_NOWALLET";
    WALLET_ID[WALLET_ID["ETHEREUM_METAMASK"] = 1] = "ETHEREUM_METAMASK";
    WALLET_ID[WALLET_ID["ETHEREUM_WALLETCONNECT"] = 2] = "ETHEREUM_WALLETCONNECT";
    WALLET_ID[WALLET_ID["ETHEREUM_COINBASE"] = 3] = "ETHEREUM_COINBASE";
    WALLET_ID[WALLET_ID["ALGORAND_MYALGO"] = 4] = "ALGORAND_MYALGO";
    WALLET_ID[WALLET_ID["ALGORAND_WALLETCONNECT"] = 5] = "ALGORAND_WALLETCONNECT";
    WALLET_ID[WALLET_ID["ALGORAND_PERAWALLET"] = 6] = "ALGORAND_PERAWALLET";
})($57b8a5d2d8300786$export$7c460c214963f696 || ($57b8a5d2d8300786$export$7c460c214963f696 = {}));
let /**
 * Wallet Hook events
 * @remarks events are based on Metamask
 */ $57b8a5d2d8300786$export$5ee9bf08a91850b9;
(function(WALLET_HOOK) {
    WALLET_HOOK[WALLET_HOOK[/**
     * User has prompted to change chains on the wallet
     */ "CHAIN_ON_CHANGE"] = 0] = "CHAIN_ON_CHANGE";
    WALLET_HOOK[WALLET_HOOK["CHAIN_ON_DISCONNECT"] = 1] = "CHAIN_ON_DISCONNECT";
    WALLET_HOOK[WALLET_HOOK["ACCOUNT_ON_CHANGE"] = 2] = "ACCOUNT_ON_CHANGE";
    WALLET_HOOK[WALLET_HOOK["ACCOUNT_ON_DISCONNECT"] = 3] = "ACCOUNT_ON_DISCONNECT";
    WALLET_HOOK[WALLET_HOOK["NEW_BLOCK"] = 4] = "NEW_BLOCK";
    WALLET_HOOK[WALLET_HOOK["CONNECT"] = 5] = "CONNECT";
})($57b8a5d2d8300786$export$5ee9bf08a91850b9 || ($57b8a5d2d8300786$export$5ee9bf08a91850b9 = {}));


var $430794692bff5f59$exports = {};

$parcel$defineInteropFlag($430794692bff5f59$exports);

$parcel$export($430794692bff5f59$exports, "default", () => $430794692bff5f59$export$2e2bcd8739ae039);


var $a5ed01349eda98bd$exports = {};
var $eeb7484c2092e8d9$exports = {};

$parcel$export($eeb7484c2092e8d9$exports, "WALLET_TYPE", () => $eeb7484c2092e8d9$export$353aefc175350117);
$parcel$export($eeb7484c2092e8d9$exports, "CHAIN_TYPE", () => $eeb7484c2092e8d9$export$be56259456d697c6);
let /**
 * Wallet types representing low level wallets
 */ $eeb7484c2092e8d9$export$353aefc175350117;
(function(WALLET_TYPE) {
    WALLET_TYPE[WALLET_TYPE["ETHEREUM_METAMASK"] = 0] = "ETHEREUM_METAMASK";
    WALLET_TYPE[WALLET_TYPE["ETHEREUM_WALLETCONNECT"] = 1] = "ETHEREUM_WALLETCONNECT";
    WALLET_TYPE[WALLET_TYPE["ETHEREUM_COINBASE"] = 2] = "ETHEREUM_COINBASE";
    WALLET_TYPE[WALLET_TYPE["ALGORAND_MYALGO"] = 3] = "ALGORAND_MYALGO";
    WALLET_TYPE[WALLET_TYPE["ALGORAND_WALLETCONNECT"] = 4] = "ALGORAND_WALLETCONNECT";
    WALLET_TYPE[WALLET_TYPE["ALGORAND_PERAWALLET"] = 5] = "ALGORAND_PERAWALLET";
})($eeb7484c2092e8d9$export$353aefc175350117 || ($eeb7484c2092e8d9$export$353aefc175350117 = {}));
let /**
 * Chain types representing blockchains above @see WALLET_TYPE are associated to
 */ $eeb7484c2092e8d9$export$be56259456d697c6;
(function(CHAIN_TYPE) {
    CHAIN_TYPE[CHAIN_TYPE["ALGORAND"] = 0] = "ALGORAND";
    CHAIN_TYPE[CHAIN_TYPE["ETHEREUM"] = 1] = "ETHEREUM";
})($eeb7484c2092e8d9$export$be56259456d697c6 || ($eeb7484c2092e8d9$export$be56259456d697c6 = {}));


$parcel$exportWildcard($a5ed01349eda98bd$exports, $eeb7484c2092e8d9$exports);


var $fc578d3576b0d8ef$exports = {};
var $ff033dcd1750fc9d$exports = {};

$parcel$export($ff033dcd1750fc9d$exports, "useWindow", () => $ff033dcd1750fc9d$export$24b8fbafc4b6a151);
const $ff033dcd1750fc9d$export$24b8fbafc4b6a151 = (cb)=>{
    if (Object.keys(globalThis).includes("window")) return cb(globalThis.window);
    else return null;
};


$parcel$exportWildcard($fc578d3576b0d8ef$exports, $ff033dcd1750fc9d$exports);


const $430794692bff5f59$var$STORAGE_KEY = "wallet-state-storage";
/**
 *  Wallet Storage is used to make the wallet state persistent even after the user refreshes the page
 *  @remarks uses the Web Storage API and may not be compatible with older browsers
 *  Maybe be replaced with less coupled implementation in the future
 */ class $430794692bff5f59$var$WalletStateStorage {
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
        this.storage?.setItem($430794692bff5f59$var$STORAGE_KEY, JSON.stringify(values));
    }
    /**
     * Validates the account string using respective chain methods
     * @param account - account string to check
     * @returns is account string valid
     */ isValidAddress(account) {
        switch(this.chain){
            case (0, $eeb7484c2092e8d9$export$be56259456d697c6).ETHEREUM:
                return (0, $8zHUo$etherslibutils.isAddress)(account);
            case (0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND:
                return (0, $8zHUo$algosdk.isValidAddress)(account);
            default:
                return false;
        }
    }
    /**
     * parse raw value
     * @returns parsed values
     */ values() {
        const values = this._storage()?.getItem($430794692bff5f59$var$STORAGE_KEY);
        return values ? JSON.parse(values) : [];
    }
    _storage() {
        return (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.localStorage);
    }
}
var $430794692bff5f59$export$2e2bcd8739ae039 = $430794692bff5f59$var$WalletStateStorage;












const $44a3b7c9aba96e50$export$92de899abf5da75a = {
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
const $44a3b7c9aba96e50$export$abdf78135f8407bb = {
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
const $44a3b7c9aba96e50$export$703a843624f42e6c = (chainId)=>{
    switch(chainId){
        case "0x1":
            return $44a3b7c9aba96e50$export$abdf78135f8407bb;
        case "0x4":
            return $44a3b7c9aba96e50$export$92de899abf5da75a;
        default:
            throw new Error(`ChainId ${chainId} configuration not found`);
    }
};


class $0012831bc1085df5$export$9e095c387372d0b1 {
    static getWindowEthereumObject() {
        return (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
    }
    static getNamedWindowEthereumObject(key, validator) {
        const ethereumGlobal = $0012831bc1085df5$export$9e095c387372d0b1.getWindowEthereumObject();
        if (!ethereumGlobal) throw new (0, $d083fd37dae77b99$export$72563c16b91dfd16)();
        if (!ethereumGlobal.providerMap) {
            if (!validator(ethereumGlobal)) throw new (0, $d083fd37dae77b99$export$72563c16b91dfd16)();
            return ethereumGlobal;
        }
        const ethereum = ethereumGlobal.providerMap.get(key);
        if (!ethereum || !validator(ethereum)) throw new (0, $d083fd37dae77b99$export$72563c16b91dfd16)();
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
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    static getIsWalletInstalled(ethereum) {
        return Boolean(ethereum);
    }
    static async fetchCurrentChainID(provider) {
        return provider.send("eth_chainId", []);
    }
    static async addChainToWallet(chainConfig) {
        (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)(async (window)=>{
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
                const chainConfig = (0, $44a3b7c9aba96e50$export$703a843624f42e6c)(chainId);
                return await this.addChainToWallet(chainConfig);
            } else throw err;
        }
    }
}






class $8077658bdae097e7$export$bf6aa8a8e97b6c5f {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $eeb7484c2092e8d9$export$be56259456d697c6).ETHEREUM, (0, $57b8a5d2d8300786$export$7c460c214963f696).ETHEREUM_NOWALLET);
    chain = null;
    constructor(){
        this._state = {
            accounts: [],
            isConnected: false
        };
    }
    _getEthereumProvider() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    _getProvider(ethereum = this._getEthereumProvider()) {
        return new (0, $8zHUo$ethers.ethers).providers.Web3Provider(ethereum);
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
    }
    async _enforceChain() {
        if (this.chain === null) return;
        const provider = await this._getProvider();
        const currentChain = await (0, $0012831bc1085df5$export$9e095c387372d0b1).fetchCurrentChainID(provider);
        if (currentChain !== this.chain) throw new Error(`Chain has changed to ${currentChain} when it should be ${this.chain}`);
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
        this._enforceChain();
        this._enforceIsConnected();
        const provider = this._getProvider();
        return (0, $0012831bc1085df5$export$9e095c387372d0b1).getSigner(provider);
    }
    async getBalance() {
        this._enforceChain();
        this._enforceIsConnected();
        const provider = this._getProvider();
        return await (0, $0012831bc1085df5$export$9e095c387372d0b1).getBalance(provider, this._state.accounts[0]);
    }
    async signOut() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    async getAssets() {
        return await (0, $0012831bc1085df5$export$9e095c387372d0b1).getAssets();
    }
    getIsConnected() {
        if (this._state.isConnected && this._state.accounts.length < 1) console.warn("wallet is marked as connected but the state.account length is 0");
        return this._state.isConnected;
    }
    getPrimaryAccount() {
        this._enforceChain();
        this._enforceIsConnected();
        if (this._state.accounts.length < 1) throw new Error("wallet is marked as connected but could not find primary account");
        return this._state.accounts[0];
    }
    getAccounts() {
        this._enforceChain();
        this._enforceIsConnected();
        if (this._state.accounts.length < 1) console.warn("wallet is marked as connected but could not find primary account");
        return this._state.accounts;
    }
    async fetchCurrentChainID() {
        const provider = await this._getProvider();
        return (0, $0012831bc1085df5$export$9e095c387372d0b1).fetchCurrentChainID(provider);
    }
    async addChainToWallet(chainConfig) {
        return (0, $0012831bc1085df5$export$9e095c387372d0b1).addChainToWallet(chainConfig);
    }
    async switchChainFromWallet(chain, updateChain = false) {
        const ethereum = this._getEthereumProvider();
        if (ethereum.networkVersion !== String(chain)) {
            await (0, $0012831bc1085df5$export$9e095c387372d0b1).switchChainFromWallet(ethereum, chain);
            if (updateChain) this.chain = chain;
        }
    }
    async forceCurrentChainID(chain) {
        if (this.chain !== null && this.chain !== chain) throw new Error(`Cannot force chain to be 0x${chain} because it is already forced to be 0x${this.chain}`);
        this.chain = chain;
        this.switchChainFromWallet(chain);
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    };
    onChainDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT, cb);
    };
    onBlockAdded = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, (block)=>{
            return cb(block);
        });
    };
    getIsWalletInstalled() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    toJSON() {
        return this._state;
    }
    /**
     * Mounts ethereum based event hooks to the hook router
     * @see https://eips.ethereum.org/EIPS/eip-1193#references for list of ethereum hooks
     */ async mountEventListeners() {
        if (!this.getIsWalletInstalled()) return;
        const ethereum = this._getEthereumProvider();
        const provider = this._getProvider();
        if (!ethereum.on) return;
        ethereum.on("accountsChanged", async (accounts)=>{
            console.log({
                accounts: accounts
            });
            this._state.accounts = accounts;
            if (accounts.length === 0) {
                await this.signOut();
                this.hookRouter.applyHooks([
                    (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
                ]);
            } else this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, accounts);
            this._updateWalletStorageValue();
        });
        ethereum.on("chainChanged", async (chainId)=>{
            this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, chainId);
        });
        ethereum.on("disconnect", async (err)=>{
            console.warn(`BaseEthereum Disconnected. Error:`);
            console.warn(err);
            this.hookRouter.applyHooks([
                (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT
            ]);
        });
        provider.on("block", (block)=>{
            this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, block);
        });
    }
    async unmountEventListeners() {
        const provider = await this._getProvider();
        provider.removeAllListeners();
    }
    async getProvider() {
        await this._enforceChain();
        return this._getProvider();
    }
}







const $bde3ffd6d211cef9$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $bde3ffd6d211cef9$export$2c78a3b4fc11d8fa extends (0, $8077658bdae097e7$export$bf6aa8a8e97b6c5f) {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $eeb7484c2092e8d9$export$be56259456d697c6).ETHEREUM, (0, $57b8a5d2d8300786$export$7c460c214963f696).ETHEREUM_METAMASK);
    name = "METAMASK";
    type = (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_METAMASK;
    constructor(state){
        super();
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$bde3ffd6d211cef9$var$initialState
        };
        this._setupInitialState();
    }
    _getEthereumProvider() {
        return (0, $0012831bc1085df5$export$9e095c387372d0b1).getNamedWindowEthereumObject("MetaMask", (ethereumObject)=>Boolean(ethereumObject.isMetaMask));
    }
    async init() {
        this.provider = await this._getProvider();
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this._state.accounts = await provider.send("eth_requestAccounts", []);
        this._state.isConnected = this._state.accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this._state.accounts);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    getIsWalletInstalled() {
        const ethereumGlobal = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
        if (!ethereumGlobal) return false;
        if (!ethereumGlobal.provider || !ethereumGlobal.providerMap) return ethereumGlobal.isMetaMask || false;
        return Boolean(ethereumGlobal.providerMap.get("MetaMask"));
    }
}


var $945de3e07d6230ad$exports = {};


$parcel$exportWildcard($2b09ea9ee8d63ad1$exports, $bde3ffd6d211cef9$exports);
$parcel$exportWildcard($2b09ea9ee8d63ad1$exports, $945de3e07d6230ad$exports);


var $d5d3dec9ab4b7763$exports = {};

$parcel$export($d5d3dec9ab4b7763$exports, "defaultEthereumConfig", () => $d5d3dec9ab4b7763$export$6e71d57116cbd2a7);
$parcel$export($d5d3dec9ab4b7763$exports, "Ethereum", () => $d5d3dec9ab4b7763$export$aa318bacd7f710c5);



var $a4d37c23c6197aec$export$2e2bcd8739ae039 = (0, $a71b91c4d64511bd$export$2e2bcd8739ae039);



var $ea303b50c6baef25$exports = {};
var $3e27f8031b2910f0$exports = {};

$parcel$export($3e27f8031b2910f0$exports, "Coinbase", () => $3e27f8031b2910f0$export$bbf33c97e5e72e4f);








const $3e27f8031b2910f0$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
const $3e27f8031b2910f0$var$defaultConfig = Object.freeze({
    coinbaseConfig: {
        appName: "Dapp",
        appLogoUrl: "",
        darkMode: false
    },
    defaultEthJsonRPCUrl: "",
    defaultChainId: 1
});
class $3e27f8031b2910f0$export$bbf33c97e5e72e4f extends (0, $8077658bdae097e7$export$bf6aa8a8e97b6c5f) {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $eeb7484c2092e8d9$export$be56259456d697c6).ETHEREUM, (0, $57b8a5d2d8300786$export$7c460c214963f696).ETHEREUM_COINBASE);
    chain = null;
    name = "COINBASE";
    type = (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_COINBASE;
    constructor(state, config = $3e27f8031b2910f0$var$defaultConfig){
        super();
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$3e27f8031b2910f0$var$initialState
        };
        this._config = config;
        this._wallet = new (0, ($parcel$interopDefault($8zHUo$coinbasewalletsdk)))(config.coinbaseConfig);
        this._setupInitialState();
    }
    _getEthereumProvider() {
        return (0, $0012831bc1085df5$export$9e095c387372d0b1).getNamedWindowEthereumObject("CoinbaseWallet", (ethereum)=>Boolean(ethereum.isCoinbaseWallet));
    }
    async init() {
        this.provider = await this._getProvider();
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this._state.accounts = await provider.send("eth_requestAccounts", []);
        this._state.isConnected = this._state.accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this._state.accounts);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    getIsWalletInstalled() {
        const ethereumGlobal = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
        if (!ethereumGlobal) return false;
        if (!ethereumGlobal.provider || !ethereumGlobal.providerMap) return ethereumGlobal.isCoinbaseWallet || false;
        return Boolean(ethereumGlobal.providerMap.get("Coinbase"));
    }
}


var $06ef6527a19c2dcc$exports = {};


$parcel$exportWildcard($ea303b50c6baef25$exports, $3e27f8031b2910f0$exports);
$parcel$exportWildcard($ea303b50c6baef25$exports, $06ef6527a19c2dcc$exports);



var $b4976c18f17a124b$exports = {};
var $bf08368245b76476$exports = {};

$parcel$export($bf08368245b76476$exports, "EthWalletConnect", () => $bf08368245b76476$export$9741c3aebc6a0fb7);






const $bf08368245b76476$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $bf08368245b76476$export$9741c3aebc6a0fb7 extends (0, $8077658bdae097e7$export$bf6aa8a8e97b6c5f) {
    _walletConnectProvider = null;
    type = (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_WALLETCONNECT;
    name = "ETHEREUM_WALLETCONNECT";
    constructor(state){
        super();
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$bf08368245b76476$var$initialState
        };
        this._setupInitialState();
    }
    _fetchWCProvider() {
        const walletConnectProvider = new (0, ($parcel$interopDefault($8zHUo$walletconnectweb3provider)))({
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
        return new (0, $8zHUo$ethers.providers).Web3Provider(provider);
    }
    getWCProvider() {
        if (this._walletConnectProvider === null) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
        return this._walletConnectProvider;
    }
    async init() {
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        await this._initProvider();
        const provider = await this._getProvider();
        this._state.accounts = await provider.listAccounts();
        this._state.isConnected = this._state.accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this._state.accounts);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        await this._deinitProvider();
        this._state.accounts = [];
        this._state.isConnected = false;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
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


var $81d7f2941b64966a$exports = {};


$parcel$exportWildcard($b4976c18f17a124b$exports, $bf08368245b76476$exports);
$parcel$exportWildcard($b4976c18f17a124b$exports, $81d7f2941b64966a$exports);


/**
 * Available Ethereum Wallets
 */ const $d5d3dec9ab4b7763$var$walletTypes = [
    (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_METAMASK,
    (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_WALLETCONNECT,
    (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_COINBASE
];
/**
 * Default config
 */ const $d5d3dec9ab4b7763$export$6e71d57116cbd2a7 = {
    hookType: "active",
    defaultWallet: (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_METAMASK
};
/***
 * Ethereum Chain Wallet used to manage ethereum wallets and invoke ethereum transactions
 */ class $d5d3dec9ab4b7763$export$aa318bacd7f710c5 {
    hookRouter = new (0, $a4d37c23c6197aec$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _initialized = false;
    _activeWallets = [];
    type = (0, $eeb7484c2092e8d9$export$be56259456d697c6).ETHEREUM;
    name = "ETHEREUM";
    /**
     * Constructor for Ethereum
     * @param config - Partial Ethereum Config to be overwritten with defaults
     * @param data - Ethereum Data to initialize with
     */ constructor(config, data){
        this._metaMask = new (0, $bde3ffd6d211cef9$export$2c78a3b4fc11d8fa)(data?.metaMask);
        this._walletConnect = new (0, $bf08368245b76476$export$9741c3aebc6a0fb7)(data?.walletConnect);
        this._coinbase = new (0, $3e27f8031b2910f0$export$bbf33c97e5e72e4f)(data?.coinbase);
        this._config = {
            ...$d5d3dec9ab4b7763$export$6e71d57116cbd2a7,
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
        wallet.onAccountChange(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE));
        wallet.onAccountDisconnect(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT));
        wallet.onChainChange(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE));
        wallet.onChainDisconnect(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT));
        wallet.onAccountChange(onAccountChange);
        wallet.onAccountDisconnect(onAccountDisconnect);
        // onBlockAdded is a chain and not a wallet specific event
        // so wallet type is not required
        if (wallet.type === this._config.defaultWallet) wallet.onBlockAdded((newBlock)=>{
            this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, [
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
        if (this._initialized) return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
        await Promise.all([
            this._metaMask,
            this._walletConnect,
            this._coinbase
        ].map(this._initEthereumWallet));
        this._initialized = true;
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    getWallet(type) {
        switch(type){
            case (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_WALLETCONNECT:
                return this._walletConnect;
            case (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_METAMASK:
                return this._metaMask;
            case (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_COINBASE:
                return this._coinbase;
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }
    getAvailableWallets() {
        return $d5d3dec9ab4b7763$var$walletTypes.filter((walletType)=>this.getWallet(walletType).getIsWalletInstalled());
    }
    getConnectedWallets() {
        return $d5d3dec9ab4b7763$var$walletTypes.filter((walletType)=>this.getWallet(walletType).getIsConnected());
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
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    };
    onBlockAdded = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, (block)=>{
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




var $273d0217424f65b7$exports = {};


$parcel$exportWildcard($be737fe08c02d508$exports, $2b09ea9ee8d63ad1$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $d5d3dec9ab4b7763$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $b4976c18f17a124b$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $273d0217424f65b7$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $ea303b50c6baef25$exports);


var $b94377bbb94beb7e$exports = {};
var $a75d728b25ccd0d3$exports = {};
var $0ca2eba87b9cb040$exports = {};

$parcel$export($0ca2eba87b9cb040$exports, "MyAlgo", () => $0ca2eba87b9cb040$export$6ab354d5c56bf95);






const $0ca2eba87b9cb040$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $0ca2eba87b9cb040$export$6ab354d5c56bf95 {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE
    ]);
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND, (0, $57b8a5d2d8300786$export$7c460c214963f696).ALGORAND_MYALGO);
    currentActiveAccountAddress = "";
    type = (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_MYALGO;
    name = "ALGORAND_MYALGO";
    constructor(state){
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$0ca2eba87b9cb040$var$initialState
        };
        this.setupInitialState();
    }
    enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
    }
    async init() {
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    getProvider() {
        if (this.provider instanceof (0, ($parcel$interopDefault($8zHUo$randlabsmyalgoconnect)))) return this.provider;
        this.provider = new (0, ($parcel$interopDefault($8zHUo$randlabsmyalgoconnect)))();
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
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
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
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
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
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getAccounts());
        });
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, ()=>{
            return cb();
        });
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
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


var $ef8a5d7e6cd10d55$exports = {};


$parcel$exportWildcard($a75d728b25ccd0d3$exports, $0ca2eba87b9cb040$exports);
$parcel$exportWildcard($a75d728b25ccd0d3$exports, $ef8a5d7e6cd10d55$exports);


var $f2b728861576b445$exports = {};

$parcel$export($f2b728861576b445$exports, "defaultAlgorandConfig", () => $f2b728861576b445$export$24f2ad57db25a90c);
$parcel$export($f2b728861576b445$exports, "Algorand", () => $f2b728861576b445$export$2a2454b5976b73ac);





var $3c9851a538a51e5f$exports = {};
var $5f075e6dc19036e9$exports = {};

$parcel$export($5f075e6dc19036e9$exports, "PeraWallet", () => $5f075e6dc19036e9$export$6a733d504587e4b0);








var $5f075e6dc19036e9$require$Buffer = $8zHUo$buffer.Buffer;
const $5f075e6dc19036e9$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $5f075e6dc19036e9$export$6a733d504587e4b0 {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE
    ]);
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND, (0, $57b8a5d2d8300786$export$7c460c214963f696).ALGORAND_PERAWALLET);
    type = (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_PERAWALLET;
    name = "ALGORAND_PERAWALLET";
    constructor(state){
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$5f075e6dc19036e9$var$initialState
        };
        this._setupInitialState();
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
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
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
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
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        this.provider?.connector?.on("disconnect", (error, _payload)=>{
            if (error) throw error;
            this.signOut();
        });
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
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
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this._enforceIsConnected();
            const peraWallet = this.getProvider();
            if (!peraWallet.connector) await peraWallet.reconnectSession();
            const txnsToSign = transactions.map((txn)=>({
                    txn: $5f075e6dc19036e9$require$Buffer.from(txn).toString("base64")
                }));
            const jsonRpcRequest = (0, $8zHUo$jsonrpctoolsutils.formatJsonRpcRequest)("algo_signTxn", [
                txnsToSign
            ]);
            const signedTxns = await peraWallet?.connector?.sendCustomRequest(jsonRpcRequest);
            const signedTxns2 = [];
            for(let i = 0; i < signedTxns.length; i++)if (signedTxns[i] !== null) signedTxns2.push({
                txID: "",
                blob: new Uint8Array($5f075e6dc19036e9$require$Buffer.from(signedTxns[i], "base64"))
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
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
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
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getAccounts());
        });
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, ()=>{
            return cb();
        });
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
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
        if (this.provider instanceof (0, $8zHUo$perawalletconnect.PeraWalletConnect)) return this.provider;
        this.provider = new (0, $8zHUo$perawalletconnect.PeraWalletConnect)();
        return this.provider;
    }
}


var $da4b8f11b1bd9933$exports = {};


$parcel$exportWildcard($3c9851a538a51e5f$exports, $5f075e6dc19036e9$exports);
$parcel$exportWildcard($3c9851a538a51e5f$exports, $da4b8f11b1bd9933$exports);


var $2062ba71daa80b8d$exports = {};
var $85900a75ff20f989$exports = {};

$parcel$export($85900a75ff20f989$exports, "WalletConnect", () => $85900a75ff20f989$export$ba0ef3a0d99fcc8f);









var $85900a75ff20f989$require$Buffer = $8zHUo$buffer.Buffer;
const $85900a75ff20f989$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $85900a75ff20f989$export$ba0ef3a0d99fcc8f {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE
    ]);
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND, (0, $57b8a5d2d8300786$export$7c460c214963f696).ALGORAND_WALLETCONNECT);
    type = (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_WALLETCONNECT;
    name = "ALGORAND_WALLETCONNECT";
    constructor(state){
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$85900a75ff20f989$var$initialState
        };
        this._setupInitialState();
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
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
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        this.provider = new (0, ($parcel$interopDefault($8zHUo$walletconnectclient)))({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: (0, ($parcel$interopDefault($8zHUo$algorandwalletconnectqrcodemodal)))
        });
        if (!this.provider.connected) // create new session
        await this.provider.createSession();
        else {
            const { accounts: accounts  } = this.provider;
            this._state.isConnected = Array.isArray(accounts) && accounts.length > 0;
            this._state.accounts = accounts;
            this._updateWalletStorageValue();
            this.hookRouter.applyHooks([
                (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
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
                (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
            ]);
        });
        this.provider.on("disconnect", (error, _payload)=>{
            if (error) throw error;
            this.signOut();
        });
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
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
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this._enforceIsConnected();
            const walletConnect = this.getProvider();
            const txnsToSign = transactions.map((txn)=>({
                    txn: $85900a75ff20f989$require$Buffer.from(txn).toString("base64")
                }));
            const jsonRpcRequest = (0, $8zHUo$jsonrpctoolsutils.formatJsonRpcRequest)("algo_signTxn", [
                txnsToSign
            ]);
            const signedTxns = await walletConnect.sendCustomRequest(jsonRpcRequest);
            const signedTxns2 = [];
            for(let i = 0; i < signedTxns.length; i++)if (signedTxns[i] !== null) signedTxns2.push({
                txID: "",
                blob: new Uint8Array($85900a75ff20f989$require$Buffer.from(signedTxns[i], "base64"))
            });
            else signedTxns2.push({
                txID: "",
                blob: null
            });
            return signedTxns2;
        };
    }
    async getBalance() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
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
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getAccounts());
        });
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, ()=>{
            return cb();
        });
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
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
        if (this.provider instanceof (0, ($parcel$interopDefault($8zHUo$walletconnectclient)))) return this.provider;
        this.provider = new (0, ($parcel$interopDefault($8zHUo$walletconnectclient)))({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: (0, ($parcel$interopDefault($8zHUo$algorandwalletconnectqrcodemodal)))
        });
        return this.provider;
    }
}


var $a1aeea648adc512e$exports = {};


$parcel$exportWildcard($2062ba71daa80b8d$exports, $85900a75ff20f989$exports);
$parcel$exportWildcard($2062ba71daa80b8d$exports, $a1aeea648adc512e$exports);


/**
 * Default config
 */ const $f2b728861576b445$export$24f2ad57db25a90c = {
    hookType: "active",
    defaultWallet: (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_MYALGO
};
/***
 * Algorand Chain Wallet used to manage algorand wallets and invoke algorand transactions
 */ class $f2b728861576b445$export$2a2454b5976b73ac {
    hookRouter = new (0, $a4d37c23c6197aec$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _initialized = false;
    _activeWallets = [];
    type = (0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND;
    name = "ALGORAND";
    /**
     * Constructor for Algorand
     * @param config - Partial Algorand Config to be overwritten with defaults
     * @param data - Algorand Data to initialize with
     */ constructor(config, data){
        this._myAlgo = new (0, $0ca2eba87b9cb040$export$6ab354d5c56bf95)(data?.myAlgo);
        this._walletConnect = new (0, $85900a75ff20f989$export$ba0ef3a0d99fcc8f)(data?.walletConnect);
        this._peraWallet = new (0, $5f075e6dc19036e9$export$6a733d504587e4b0)(data?.peraWallet);
        this._config = {
            ...$f2b728861576b445$export$24f2ad57db25a90c,
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
        wallet.onAccountChange(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE));
        wallet.onAccountDisconnect(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT));
        wallet.onChainChange(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE));
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
        if (this._initialized) return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
        this._initialized = true;
        await Promise.all([
            this._myAlgo,
            this._walletConnect,
            this._peraWallet
        ].map(this._initAlgorandWallet));
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    getWallet(type) {
        switch(type){
            case (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_MYALGO:
                return this._myAlgo;
            case (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_WALLETCONNECT:
                return this._walletConnect;
            case (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_PERAWALLET:
                return this._peraWallet;
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }
    getAvailableWallets() {
        const walletTypes = [
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_MYALGO,
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_PERAWALLET,
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_WALLETCONNECT
        ];
        return walletTypes.filter((walletType)=>this.getWallet(walletType).getIsWalletInstalled());
    }
    getConnectedWallets() {
        const walletTypes = [
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_MYALGO,
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_PERAWALLET,
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ALGORAND_WALLETCONNECT
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
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
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




var $a537c0854f3949b4$exports = {};


$parcel$exportWildcard($b94377bbb94beb7e$exports, $a75d728b25ccd0d3$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $f2b728861576b445$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $2062ba71daa80b8d$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $3c9851a538a51e5f$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $a537c0854f3949b4$exports);




var $6d7ab2c3273ba179$exports = {};

$parcel$export($6d7ab2c3273ba179$exports, "SuperWallet", () => $6d7ab2c3273ba179$export$f5a985e9820441e);






/**
 * Super Wallet Class. One Wallet to rule them all
 * Manages Chain + Wallet and allows you to seamlessly switch between using one interface
 */ class $6d7ab2c3273ba179$export$f5a985e9820441e {
    hookRouter = new (0, $a4d37c23c6197aec$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _initialized = false;
    _activeChain = [];
    constructor(config, data){
        this._config = config;
        let algorandConfig = (0, $f2b728861576b445$export$24f2ad57db25a90c);
        let ethereumConfig = (0, $d5d3dec9ab4b7763$export$6e71d57116cbd2a7);
        const algorandState = data?.algorand;
        const ethereumState = data?.ethereum;
        this._config.chains.map((chain)=>{
            if (chain.type === (0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND) algorandConfig = {
                ...algorandConfig,
                ...chain.config
            };
            if (chain.type === (0, $eeb7484c2092e8d9$export$be56259456d697c6).ETHEREUM) ethereumConfig = {
                ...ethereumConfig,
                ...chain.config
            };
        });
        this._algorand = new (0, $f2b728861576b445$export$2a2454b5976b73ac)(algorandConfig, algorandState);
        this._ethereum = new (0, $d5d3dec9ab4b7763$export$aa318bacd7f710c5)(ethereumConfig, ethereumState);
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
        chain.onAccountChange(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE));
        chain.onAccountDisconnect(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT));
        chain.onChainChange(hook((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE));
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
            (0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND,
            (0, $eeb7484c2092e8d9$export$be56259456d697c6).ETHEREUM
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
        if (this._initialized) return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
        this._initialized = true;
        await Promise.all([
            this._algorand,
            this._ethereum
        ].map(this._initSuperWalletChain));
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    /**
     * Get Chain
     * @param type - chain type
     * @returns chain interface
     */ getChain(type) {
        switch(type){
            case (0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND:
                return this._algorand;
            case (0, $eeb7484c2092e8d9$export$be56259456d697c6).ETHEREUM:
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
        if (chain instanceof (0, $f2b728861576b445$export$2a2454b5976b73ac)) return chain.getWallet(walletType);
        return chain.getWallet(walletType);
    }
    /**
     * Get all available wallet from chain
     * @param chainType - chain type
     * @returns all available wallets on chain
     */ getAvailableWalletsOnChain(chainType) {
        if (chainType === (0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND) return this._algorand.getAvailableWallets();
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
        if (chainType === (0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND) return this._algorand.getConnectedWallets();
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
        if (chainType === (0, $eeb7484c2092e8d9$export$be56259456d697c6).ALGORAND) return this._algorand.getActiveWallet();
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
        if (chain instanceof (0, $f2b728861576b445$export$2a2454b5976b73ac)) return chain.updateActiveWallet(walletType);
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
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    onAccountChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    };
    onChainChange = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    };
    onAccountDisconnect = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    };
    onBlockAdded = (_cb)=>{
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    };
    toJSON() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
}



$parcel$exportWildcard(module.exports, $faefaad95e5fcca0$exports);
$parcel$exportWildcard(module.exports, $d083fd37dae77b99$exports);
$parcel$exportWildcard(module.exports, $be737fe08c02d508$exports);
$parcel$exportWildcard(module.exports, $b94377bbb94beb7e$exports);
$parcel$exportWildcard(module.exports, $fc578d3576b0d8ef$exports);
$parcel$exportWildcard(module.exports, $a5ed01349eda98bd$exports);
$parcel$exportWildcard(module.exports, $6d7ab2c3273ba179$exports);
$parcel$exportWildcard(module.exports, $430794692bff5f59$exports);


//# sourceMappingURL=index.js.map
