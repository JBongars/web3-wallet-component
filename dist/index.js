var $8zHUo$ethers = require("ethers");
var $8zHUo$algosdk = require("algosdk");
var $8zHUo$etherslibutils = require("ethers/lib/utils");
var $8zHUo$randlabsmyalgoconnect = require("@randlabs/myalgo-connect");
var $8zHUo$jsonrpctoolsutils = require("@json-rpc-tools/utils");
var $8zHUo$perawalletconnect = require("@perawallet/connect");
var $8zHUo$buffer = require("buffer");
var $8zHUo$walletconnectclient = require("@walletconnect/client");
var $8zHUo$algorandwalletconnectqrcodemodal = require("algorand-walletconnect-qrcode-modal");
var $8zHUo$axios = require("axios");
var $8zHUo$walletconnectweb3provider = require("@walletconnect/web3-provider");

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

$parcel$export($be737fe08c02d508$exports, "CHAIN_ETHEREUM", () => $be737fe08c02d508$export$aef6a8518da1f60c);
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
 */ class $a71b91c4d64511bd$var$HookRouter {
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
var $a71b91c4d64511bd$export$2e2bcd8739ae039 = $a71b91c4d64511bd$var$HookRouter;


let /**
 * Wallet statuses
 */ $57b8a5d2d8300786$export$de76a1f31766a0a2;
(function(WALLET_STATUS1) {
    WALLET_STATUS1[WALLET_STATUS1[/**
     * Wallet is OK
     */ "OK"] = 0] = "OK";
    WALLET_STATUS1[WALLET_STATUS1[/**
     * There was a problem logging in
     * @remarks user may have cancelled the transaction
     */ "LOGIN_ERROR"] = 1] = "LOGIN_ERROR";
    WALLET_STATUS1[WALLET_STATUS1[/**
     * There was a problem initializing the wallet
     */ "WALLET_ERROR"] = 2] = "WALLET_ERROR";
    WALLET_STATUS1[WALLET_STATUS1[/**
     * There was a problem initializing the  wallet because the extension was not found
     */ "EXTENSION_NOT_FOUND"] = 3] = "EXTENSION_NOT_FOUND";
    WALLET_STATUS1[WALLET_STATUS1[/**
     * The Wallet account was not found
     */ "ACCOUNT_NOT_FOUND"] = 4] = "ACCOUNT_NOT_FOUND";
})($57b8a5d2d8300786$export$de76a1f31766a0a2 || ($57b8a5d2d8300786$export$de76a1f31766a0a2 = {}));
let /**
 * Identifier for Wallet
 * @remarks example Metamask, WalletConnect, etc...
 * sorting should be same as WALLET_TYPE
 */ $57b8a5d2d8300786$export$7c460c214963f696;
(function(WALLET_ID1) {
    WALLET_ID1[WALLET_ID1["ETHEREUM_METAMASK"] = 0] = "ETHEREUM_METAMASK";
    WALLET_ID1[WALLET_ID1["ETHEREUM_WALLETCONNECT"] = 1] = "ETHEREUM_WALLETCONNECT";
    WALLET_ID1[WALLET_ID1["ALGORAND_MYALGO"] = 2] = "ALGORAND_MYALGO";
    WALLET_ID1[WALLET_ID1["ALGORAND_WALLETCONNECT"] = 3] = "ALGORAND_WALLETCONNECT";
    WALLET_ID1[WALLET_ID1["ALGORAND_PERAWALLET"] = 4] = "ALGORAND_PERAWALLET";
})($57b8a5d2d8300786$export$7c460c214963f696 || ($57b8a5d2d8300786$export$7c460c214963f696 = {}));
let /**
 * Wallet Hook events
 * @remarks events are based on Metamask
 */ $57b8a5d2d8300786$export$5ee9bf08a91850b9;
(function(WALLET_HOOK1) {
    WALLET_HOOK1[WALLET_HOOK1[/**
     * User has prompted to change chains on the wallet
     */ "CHAIN_ON_CHANGE"] = 0] = "CHAIN_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["CHAIN_ON_DISCONNECT"] = 1] = "CHAIN_ON_DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_CHANGE"] = 2] = "ACCOUNT_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_DISCONNECT"] = 3] = "ACCOUNT_ON_DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["NEW_BLOCK"] = 4] = "NEW_BLOCK";
    WALLET_HOOK1[WALLET_HOOK1["CONNECT"] = 5] = "CONNECT";
})($57b8a5d2d8300786$export$5ee9bf08a91850b9 || ($57b8a5d2d8300786$export$5ee9bf08a91850b9 = {}));


var $430794692bff5f59$exports = {};

$parcel$defineInteropFlag($430794692bff5f59$exports);

$parcel$export($430794692bff5f59$exports, "default", () => $430794692bff5f59$export$2e2bcd8739ae039);


var $b94377bbb94beb7e$exports = {};

$parcel$export($b94377bbb94beb7e$exports, "CHAIN_ALGORAND", () => $b94377bbb94beb7e$export$2e84527d78ea64a4);
var $a75d728b25ccd0d3$exports = {};
var $0ca2eba87b9cb040$exports = {};

$parcel$export($0ca2eba87b9cb040$exports, "MyAlgo", () => $0ca2eba87b9cb040$export$6ab354d5c56bf95);






var $eeb7484c2092e8d9$exports = {};

$parcel$export($eeb7484c2092e8d9$exports, "WALLET_TYPE", () => $eeb7484c2092e8d9$export$353aefc175350117);
$parcel$export($eeb7484c2092e8d9$exports, "CHAIN_TYPE", () => $eeb7484c2092e8d9$export$be56259456d697c6);
let /**
 * Wallet types representing low level wallets
 */ $eeb7484c2092e8d9$export$353aefc175350117;
(function(WALLET_TYPE1) {
    WALLET_TYPE1[WALLET_TYPE1["ETHEREUM_METAMASK"] = 0] = "ETHEREUM_METAMASK";
    WALLET_TYPE1[WALLET_TYPE1["ETHEREUM_WALLETCONNECT"] = 1] = "ETHEREUM_WALLETCONNECT";
    WALLET_TYPE1[WALLET_TYPE1["ALGORAND_MYALGO"] = 2] = "ALGORAND_MYALGO";
    WALLET_TYPE1[WALLET_TYPE1["ALGORAND_WALLETCONNECT"] = 3] = "ALGORAND_WALLETCONNECT";
    WALLET_TYPE1[WALLET_TYPE1["ALGORAND_PERAWALLET"] = 4] = "ALGORAND_PERAWALLET";
})($eeb7484c2092e8d9$export$353aefc175350117 || ($eeb7484c2092e8d9$export$353aefc175350117 = {}));
let /**
 * Chain types representing blockchains above @see WALLET_TYPE are associated to
 */ $eeb7484c2092e8d9$export$be56259456d697c6;
(function(CHAIN_TYPE1) {
    CHAIN_TYPE1[CHAIN_TYPE1["ALGORAND"] = 0] = "ALGORAND";
    CHAIN_TYPE1[CHAIN_TYPE1["ETHEREUM"] = 1] = "ETHEREUM";
})($eeb7484c2092e8d9$export$be56259456d697c6 || ($eeb7484c2092e8d9$export$be56259456d697c6 = {}));


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
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $b94377bbb94beb7e$export$2e84527d78ea64a4), (0, $57b8a5d2d8300786$export$7c460c214963f696).ALGORAND_MYALGO);
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



var $a4d37c23c6197aec$export$2e2bcd8739ae039 = (0, $a71b91c4d64511bd$export$2e2bcd8739ae039);




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
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $b94377bbb94beb7e$export$2e84527d78ea64a4), (0, $57b8a5d2d8300786$export$7c460c214963f696).ALGORAND_PERAWALLET);
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
        if (!this.provider) {
            this.provider = this.getProvider();
            await this.provider.reconnectSession();
        }
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
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $b94377bbb94beb7e$export$2e84527d78ea64a4), (0, $57b8a5d2d8300786$export$7c460c214963f696).ALGORAND_WALLETCONNECT);
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
            if (this.provider?.connected) await this.provider?.killSession();
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
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
}




var $a537c0854f3949b4$exports = {};


const $b94377bbb94beb7e$export$2e84527d78ea64a4 = "ALGORAND";
$parcel$exportWildcard($b94377bbb94beb7e$exports, $a75d728b25ccd0d3$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $f2b728861576b445$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $2062ba71daa80b8d$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $3c9851a538a51e5f$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $a537c0854f3949b4$exports);


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
            case 0, $be737fe08c02d508$export$aef6a8518da1f60c:
                return (0, $8zHUo$etherslibutils.isAddress)(account);
            case 0, $b94377bbb94beb7e$export$2e84527d78ea64a4:
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







const $44a3b7c9aba96e50$export$abdf78135f8407bb = {
    chainName: "Ethereum Mainnet",
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
const $44a3b7c9aba96e50$var$ropstenEth = {
    chainName: "Ropsten Test Network",
    chainId: "0x3",
    nativeCurrency: {
        name: "RopstenETH",
        decimals: 18,
        symbol: "RopstenETH"
    },
    rpcUrls: [
        "https://ropsten.etherscan.io"
    ]
};
const $44a3b7c9aba96e50$export$92de899abf5da75a = {
    chainName: "Rinkeby Test Network",
    chainId: "0x4",
    nativeCurrency: {
        name: "RinkebyETH",
        decimals: 18,
        symbol: "RinkebyETH"
    },
    rpcUrls: [
        "https://rinkeby.etherscan.io"
    ]
};
const $44a3b7c9aba96e50$var$goerliEth = {
    chainName: "Goerli Test Network",
    chainId: "0x5",
    nativeCurrency: {
        name: "GoerliETH",
        decimals: 18,
        symbol: "GoerliETH"
    },
    rpcUrls: [
        "https://goerli.etherscan.io"
    ]
};
const $44a3b7c9aba96e50$var$kovanEth = {
    chainName: "Kovan Test Network",
    chainId: "0x2a",
    nativeCurrency: {
        name: "KovanETH",
        decimals: 18,
        symbol: "KovanETH"
    },
    rpcUrls: [
        "https://kovan.etherscan.io"
    ]
};
const $44a3b7c9aba96e50$var$sepoliaEth = {
    chainName: "Sepolia Test Network",
    chainId: "0xaa36a7",
    nativeCurrency: {
        name: "SepoliaETH",
        decimals: 18,
        symbol: "SepoliaETH"
    },
    rpcUrls: [
        "https://sepolia.etherscan.io"
    ]
};
const $44a3b7c9aba96e50$export$703a843624f42e6c = async (chainId)=>{
    const { data: data  } = await (0, ($parcel$interopDefault($8zHUo$axios))).get("https://chainid.network/chains.json");
    const item = data.find((datum)=>datum.networkId === chainId);
    switch(chainId){
        case 1:
            return $44a3b7c9aba96e50$export$abdf78135f8407bb;
        case 3:
            return $44a3b7c9aba96e50$var$ropstenEth;
        case 4:
            return $44a3b7c9aba96e50$export$92de899abf5da75a;
        case 5:
            return $44a3b7c9aba96e50$var$goerliEth;
        case 42:
            return $44a3b7c9aba96e50$var$kovanEth;
        case 11155111:
            return $44a3b7c9aba96e50$var$sepoliaEth;
        default:
            if (item) return {
                chainName: item.title,
                chainId: (0, $8zHUo$ethers.ethers).utils.hexlify(item.networkId),
                nativeCurrency: item.nativeCurrency,
                rpcUrls: item.rpc
            };
            else throw new Error(`ChainId ${chainId} configuration not found`);
    }
};


const $bde3ffd6d211cef9$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $bde3ffd6d211cef9$export$2c78a3b4fc11d8fa {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    _walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $be737fe08c02d508$export$aef6a8518da1f60c), (0, $57b8a5d2d8300786$export$7c460c214963f696).ETHEREUM_METAMASK);
    chain = null;
    name = "METAMASK";
    type = (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_METAMASK;
    constructor(state){
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$bde3ffd6d211cef9$var$initialState
        };
        this._setupInitialState();
    }
    async _getProvider() {
        if (this.provider) return this.provider;
        if (!this._ethereum) throw new (0, $d083fd37dae77b99$export$72563c16b91dfd16)();
        return new (0, $8zHUo$ethers.ethers).providers.Web3Provider(this._ethereum, "any");
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
    }
    async _enforceChain() {
        if (this.chain === null) return;
        const provider = await this._getProvider();
        const currentChain = await provider.send("eth_chainId", []);
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
        this._state.accounts = [];
        this._state.isConnected = false;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        if (!this.getIsConnected()) return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).WALLET_ERROR;
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        this._enforceChain();
        this._enforceIsConnected();
        const provider = this.provider || await this._getProvider();
        return provider.getSigner();
    }
    async getBalance() {
        this._enforceChain();
        this._enforceIsConnected();
        const provider = this.provider || await this._getProvider();
        const balance = await provider.getBalance(this._state.accounts[0]);
        return balance.toString();
    }
    async getAssets() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    getIsConnected() {
        return this._state.isConnected;
    }
    getIsWalletInstalled() {
        const ethereum = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
        if (!ethereum) return false;
        // Metamask and Coinbase/Other Wallet are both installed
        // Choose the correct injected wallet
        if ("providers" in ethereum && ethereum.providers?.length) {
            for (let p of ethereum.providers)if (p.isMetaMask) {
                this._ethereum = p;
                return true;
            }
        } else {
            if (ethereum.isMetaMask) // Force [disable extension/disable overriding Metamask option] of Coin98 Wallet before Metamask can be used
            {
                if (!("isCoin98" in ethereum && ethereum.isCoin98)) {
                    this._ethereum = ethereum;
                    return true;
                }
            }
        }
        // Force signout to prevent errors when other wallets intercept Metamask
        this.signOut();
        return false;
    }
    getPrimaryAccount() {
        this._enforceChain();
        this._enforceIsConnected();
        return this._state.accounts[0];
    }
    getAccounts() {
        this._enforceChain();
        this._enforceIsConnected();
        return this._state.accounts;
    }
    async fetchCurrentChainID() {
        const provider = await this._getProvider();
        const chainId = await provider.send("eth_chainId", []);
        return chainId;
    }
    async addChainToWallet(chainConfig) {
        return this._ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                chainConfig
            ]
        });
    }
    async switchChainFromWallet(chain) {
        if (this._ethereum.networkVersion !== chain) try {
            await this._ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: `0x${chain}`
                    }
                ]
            });
        } catch (err) {
            if (err && err.code === 4902) {
                const chainConfig = await (0, $44a3b7c9aba96e50$export$703a843624f42e6c)(chain);
                await this.addChainToWallet(chainConfig);
            } else throw err;
        }
    }
    async forceCurrentChainID(chain) {
        if (this.chain !== null && this.chain !== `0x${chain}`) throw new Error(`Cannot force chain to be 0x${chain} because it is already forced to be 0x${this.chain}`);
        this.chain = `0x${chain}`;
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
    toJSON() {
        return this._state;
    }
    /**
     * Mounts ethereum based event hooks to the hook router
     * @see https://eips.ethereum.org/EIPS/eip-1193#references for list of ethereum hooks
     */ async mountEventListeners() {
        const provider = await this._getProvider();
        if (this._ethereum && this._ethereum.on) {
            this._ethereum.on("accountsChanged", async (accounts)=>{
                this._state.accounts = accounts;
                if (accounts.length === 0) {
                    await this.signOut();
                    this.hookRouter.applyHooks([
                        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
                    ]);
                } else this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, accounts);
                this._updateWalletStorageValue();
            });
            this._ethereum.on("chainChanged", async (chainId)=>{
                this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, chainId);
            });
            this._ethereum.on("disconnect", async (err)=>{
                console.warn(`Metamask Disconnected. Error:`);
                console.warn(err);
                this.hookRouter.applyHooks([
                    (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT
                ]);
            });
        }
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


var $945de3e07d6230ad$exports = {};


$parcel$exportWildcard($2b09ea9ee8d63ad1$exports, $bde3ffd6d211cef9$exports);
$parcel$exportWildcard($2b09ea9ee8d63ad1$exports, $945de3e07d6230ad$exports);


var $d5d3dec9ab4b7763$exports = {};

$parcel$export($d5d3dec9ab4b7763$exports, "defaultEthereumConfig", () => $d5d3dec9ab4b7763$export$6e71d57116cbd2a7);
$parcel$export($d5d3dec9ab4b7763$exports, "Ethereum", () => $d5d3dec9ab4b7763$export$aa318bacd7f710c5);





var $b4976c18f17a124b$exports = {};
var $bf08368245b76476$exports = {};

$parcel$export($bf08368245b76476$exports, "EthWalletConnect", () => $bf08368245b76476$export$9741c3aebc6a0fb7);











const $bf08368245b76476$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $bf08368245b76476$export$9741c3aebc6a0fb7 {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK
    ]);
    chain = null;
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $be737fe08c02d508$export$aef6a8518da1f60c), (0, $57b8a5d2d8300786$export$7c460c214963f696).ETHEREUM_WALLETCONNECT);
    type = (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_WALLETCONNECT;
    name = "ETHEREUM_WALLETCONNECT";
    constructor(state){
        if (state) this._state = {
            ...state
        };
        else this._state = {
            ...$bf08368245b76476$var$initialState
        };
        this._setupInitialState();
    }
    _setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this._state = {
            isConnected: storageValue.isConnected,
            accounts: storageValue.accounts
        };
    }
    _updateWalletStorageValue() {
        if (this._state.isConnected && this._state.accounts.length > 0) this.walletStorage.updateValue(true, this._state.accounts[0], this._state.accounts);
        else this.walletStorage.updateValue(false, "", []);
    }
    async _getProvider() {
        const provider = await this.getWCProvider();
        return new (0, $8zHUo$ethers.providers).Web3Provider(provider);
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
    }
    async _enforceChain() {
        if (this.chain === null) return;
        const provider = await this._getProvider();
        const currentChain = await provider.send("eth_chainId", []);
        if (currentChain !== this.chain) throw new Error(`Chain has changed to ${currentChain} when it should be ${this.chain}`);
    }
    async getWCProvider() {
        const { data: chains  } = await (0, ($parcel$interopDefault($8zHUo$axios))).get("https://chainid.network/chains.json");
        const ignoredChainIds = [
            1,
            3,
            4,
            5,
            42,
            11155111
        ];
        const filteredChains = chains.filter((chain)=>{
            return !ignoredChainIds.includes(chain.networkId);
        });
        const rpc = {
            1: "https://rpc.ankr.com/eth",
            3: "https://rpc.ankr.com/eth_ropsten",
            4: "https://rpc.ankr.com/eth_rinkeby",
            5: "https://rpc.ankr.com/eth_goerli",
            42: "https://kovan.etherscan.io",
            11155111: "https://sepolia.etherscan.io"
        };
        if (filteredChains && filteredChains.length) filteredChains.forEach((chain)=>{
            rpc[chain.networkId] = chain.rpc[0];
        });
        const provider = new (0, ($parcel$interopDefault($8zHUo$walletconnectweb3provider)))({
            rpc: rpc,
            qrcode: true
        });
        await provider.enable();
        provider.on("accountsChanged", async (accounts)=>{
            this._state.accounts = accounts;
            if (accounts.length === 0) {
                await this.signOut();
                this.hookRouter.applyHooks([
                    (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
                ]);
            } else this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, accounts);
            this._updateWalletStorageValue();
        });
        provider.on("chainChanged", async (chainId)=>{
            const id = (0, $8zHUo$ethers.ethers).utils.hexValue(chainId);
            this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, id);
        });
        provider.on("disconnect", async (_code, _reason)=>{
            this.hookRouter.applyHooks([
                (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT
            ]);
        });
        return provider;
    }
    async init() {
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this._state.accounts = await provider.listAccounts();
        this._state.isConnected = this._state.accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this._state.accounts);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this.provider = undefined;
        this._updateWalletStorageValue();
        (await this.getWCProvider()).disconnect();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        this._enforceChain();
        this._enforceIsConnected();
        const provider = this.provider || await this._getProvider();
        return provider.getSigner();
    }
    async getBalance() {
        this._enforceChain();
        this._enforceIsConnected();
        const provider = await this._getProvider();
        const balance = await provider.getBalance(this._state.accounts[0]);
        return balance.toString();
    }
    async getAssets() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    getIsConnected() {
        return this._state.isConnected;
    }
    getIsWalletInstalled() {
        const ethereum = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
        return Boolean(ethereum);
    }
    getPrimaryAccount() {
        this._enforceChain();
        this._enforceIsConnected();
        return this._state.accounts[0];
    }
    getAccounts() {
        this._enforceChain();
        this._enforceIsConnected();
        return this._state.accounts;
    }
    async fetchCurrentChainID() {
        const provider = await this._getProvider();
        const chainId = await provider.send("eth_chainId", []);
        return chainId;
    }
    async addChainToWallet(chainConfig) {
        return (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)(async (window)=>window.ethereum?.request({
                method: "wallet_addEthereumChain",
                params: [
                    chainConfig
                ]
            }));
    }
    async switchChainFromWallet(chain) {
        const ethereum = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((window)=>window.ethereum);
        if (ethereum.networkVersion !== chain) try {
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: `0x${chain}`
                    }
                ]
            });
        } catch (err) {
            if (err && err.code === 4902) {
                const chainConfig = await (0, $44a3b7c9aba96e50$export$703a843624f42e6c)(chain);
                await this.addChainToWallet(chainConfig);
            } else throw err;
        }
    }
    async forceCurrentChainID(chain) {
        if (this.chain !== null && this.chain !== `0x${chain}`) throw new Error(`Cannot force chain to be 0x${chain} because it is already forced to be 0x${this.chain}`);
        this.chain = `0x${chain}`;
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
    toJSON() {
        return this._state;
    }
    async mountEventListeners() {
        return;
    }
    async unmountEventListeners() {
        return;
    }
    async getProvider() {
        await this._enforceChain();
        return await this._getProvider();
    }
}


var $81d7f2941b64966a$exports = {};


$parcel$exportWildcard($b4976c18f17a124b$exports, $bf08368245b76476$exports);
$parcel$exportWildcard($b4976c18f17a124b$exports, $81d7f2941b64966a$exports);


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
            this._walletConnect
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
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }
    getAvailableWallets() {
        const walletTypes = [
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_METAMASK,
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_WALLETCONNECT
        ];
        return walletTypes.filter((walletType)=>this.getWallet(walletType).getIsWalletInstalled());
    }
    getConnectedWallets() {
        const walletTypes = [
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_METAMASK,
            (0, $eeb7484c2092e8d9$export$353aefc175350117).ETHEREUM_WALLETCONNECT
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
    onBlockAdded = (cb)=>{
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, (block)=>{
            return cb(block);
        });
    };
    toJSON() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
}



var $273d0217424f65b7$exports = {};


const $be737fe08c02d508$export$aef6a8518da1f60c = "ETHEREUM";
$parcel$exportWildcard($be737fe08c02d508$exports, $2b09ea9ee8d63ad1$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $d5d3dec9ab4b7763$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $b4976c18f17a124b$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $273d0217424f65b7$exports);




var $a5ed01349eda98bd$exports = {};

$parcel$exportWildcard($a5ed01349eda98bd$exports, $eeb7484c2092e8d9$exports);


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
