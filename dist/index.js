var $8zHUo$ethers = require("ethers");
var $8zHUo$algosdk = require("algosdk");
var $8zHUo$etherslibutils = require("ethers/lib/utils");
var $8zHUo$randlabsmyalgoconnect = require("@randlabs/myalgo-connect");
var $8zHUo$walletconnectclient = require("@walletconnect/client");
var $8zHUo$algorandwalletconnectqrcodemodal = require("algorand-walletconnect-qrcode-modal");
var $8zHUo$jsonrpctoolsutils = require("@json-rpc-tools/utils");
var $8zHUo$buffer = require("buffer");
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
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $faefaad95e5fcca0$exports = {};


var $d083fd37dae77b99$exports = {};

$parcel$export($d083fd37dae77b99$exports, "NotImplementedError", () => $d083fd37dae77b99$export$e162153238934121);
$parcel$export($d083fd37dae77b99$exports, "WalletNotInstalledError", () => $d083fd37dae77b99$export$72563c16b91dfd16);
$parcel$export($d083fd37dae77b99$exports, "WalletNotConnectedError", () => $d083fd37dae77b99$export$313d299817c74896);
$parcel$export($d083fd37dae77b99$exports, "HookNotAvailableError", () => $d083fd37dae77b99$export$f4d277c155d1965e);
class $d083fd37dae77b99$export$e162153238934121 extends Error {
    constructor(message = "NotImplementedError"){
        super(message);
        this.name = "NotImplementedError";
    }
}
class $d083fd37dae77b99$export$72563c16b91dfd16 extends Error {
    constructor(message = "WalletNotInstalledError"){
        super(message);
        this.name = "WalletNotInstalledError";
    }
}
class $d083fd37dae77b99$export$313d299817c74896 extends Error {
    constructor(message = "WalletNotConnectedError"){
        super(message);
        this.name = "WalletNotConnectedError";
    }
}
class $d083fd37dae77b99$export$f4d277c155d1965e extends Error {
    constructor(message = "HookNotAvailableError"){
        super(message);
        this.name = "HookNotAvailableError";
    }
}


var $be737fe08c02d508$exports = {};

$parcel$export($be737fe08c02d508$exports, "CHAIN_ETHEREUM", () => $be737fe08c02d508$export$aef6a8518da1f60c);
var $2b09ea9ee8d63ad1$exports = {};

$parcel$export($2b09ea9ee8d63ad1$exports, "Metamask", () => $2b09ea9ee8d63ad1$export$2c78a3b4fc11d8fa);



class $a71b91c4d64511bd$var$HookRouter {
    constructor(hooks){
        this.hooks = new Map();
        this.availableHooks = hooks;
        this.resetAllHooks();
    }
    checkIfValidHook(hook) {
        if (!this.hooks.has(hook)) throw new (0, $d083fd37dae77b99$export$f4d277c155d1965e)();
    }
    getAvailableHooks() {
        return [
            ...this.availableHooks
        ];
    }
    resetHook(hook) {
        this.checkIfValidHook(hook);
        this.hooks.delete(hook);
        this.hooks.set(hook, new Map());
    }
    resetAllHooks() {
        this.availableHooks.forEach((hook)=>{
            this.hooks.set(hook, new Map());
        });
    }
    registerCallback(hook, cb) {
        this.checkIfValidHook(hook);
        const id = Symbol();
        this.hooks.get(hook)?.set(id, cb);
        return {
            id: id,
            destroy: ()=>this.deregisterCallback(hook, id)
        };
    }
    deregisterCallback(hook, id) {
        this.checkIfValidHook(hook);
        this.hooks.get(hook)?.delete(id);
    }
    async applyHooks(hooks) {
        const callbacksToInvoke = [];
        hooks.forEach((hook)=>{
            this.hooks.get(hook)?.forEach((fn)=>callbacksToInvoke.push(fn));
        });
        await Promise.all(callbacksToInvoke.map((fn)=>fn()));
    }
    async applyHookWithArgs(hook, ...args) {
        const callbacksToInvoke = [];
        this.hooks.get(hook)?.forEach((fn)=>callbacksToInvoke.push(fn));
        await Promise.all(callbacksToInvoke.map((fn)=>fn(...args)));
    }
}
var $a71b91c4d64511bd$export$2e2bcd8739ae039 = $a71b91c4d64511bd$var$HookRouter;


let $57b8a5d2d8300786$export$de76a1f31766a0a2;
(function(WALLET_STATUS1) {
    WALLET_STATUS1[WALLET_STATUS1["OK"] = 0] = "OK";
    WALLET_STATUS1[WALLET_STATUS1["LOGIN_ERROR"] = 1] = "LOGIN_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["WALLET_ERROR"] = 2] = "WALLET_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["EXTENSION_NOT_FOUND"] = 3] = "EXTENSION_NOT_FOUND";
    WALLET_STATUS1[WALLET_STATUS1["ACCOUNT_NOT_FOUND"] = 4] = "ACCOUNT_NOT_FOUND";
})($57b8a5d2d8300786$export$de76a1f31766a0a2 || ($57b8a5d2d8300786$export$de76a1f31766a0a2 = {}));
let $57b8a5d2d8300786$export$5ee9bf08a91850b9;
(function(WALLET_HOOK1) {
    WALLET_HOOK1[WALLET_HOOK1["CHAIN_ON_CHANGE"] = 0] = "CHAIN_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["CHAIN_ON_DISCONNECT"] = 1] = "CHAIN_ON_DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_CHANGE"] = 2] = "ACCOUNT_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_DISCONNECT"] = 3] = "ACCOUNT_ON_DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["NEW_BLOCK"] = 4] = "NEW_BLOCK";
    WALLET_HOOK1[WALLET_HOOK1["CONNECT"] = 5] = "CONNECT";
})($57b8a5d2d8300786$export$5ee9bf08a91850b9 || ($57b8a5d2d8300786$export$5ee9bf08a91850b9 = {}));




var $b94377bbb94beb7e$exports = {};

$parcel$export($b94377bbb94beb7e$exports, "CHAIN_ALGORAND", () => $b94377bbb94beb7e$export$2e84527d78ea64a4);
var $a75d728b25ccd0d3$exports = {};

$parcel$export($a75d728b25ccd0d3$exports, "MyAlgo", () => $a75d728b25ccd0d3$export$6ab354d5c56bf95);






const $a75d728b25ccd0d3$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $a75d728b25ccd0d3$export$6ab354d5c56bf95 {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, 
    ]);
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $b94377bbb94beb7e$export$2e84527d78ea64a4));
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$a75d728b25ccd0d3$var$initialState
        };
        this.setupInitialState();
    }
    enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
    }
    async init() {
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signIn(options = {}) {
        const shouldSelectOneAccount = options.shouldSelectOneAccount || true;
        const myAlgoConnect = this.getProvider();
        // forces user to only choose one account.
        // This prevents a lot of edge cases.
        this.state.accounts = await myAlgoConnect.connect({
            shouldSelectOneAccount: shouldSelectOneAccount
        });
        this.state.isConnected = this.state.accounts.length > 0;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
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
        return this.state.isConnected;
    }
    getPrimaryAccount() {
        return this.state.accounts[0];
    }
    getAccounts() {
        return this.state.accounts;
    }
    async fetchCurrentChainID() {
        return "0x1";
    }
    onAccountChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getPrimaryAccount());
        });
    }
    onChainChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    }
    onBlockAdded(cb) {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    toJSON() {
        return this.state;
    }
    getProvider() {
        if (this.provider instanceof (0, ($parcel$interopDefault($8zHUo$randlabsmyalgoconnect)))) return this.provider;
        this.provider = new (0, ($parcel$interopDefault($8zHUo$randlabsmyalgoconnect)))();
        return this.provider;
    }
    setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this.state = {
            isConnected: !storageValue.walletconnect && storageValue.isConnected,
            accounts: [
                {
                    name: "",
                    address: storageValue.account
                }
            ]
        };
    }
    updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) this.walletStorage.updateValue(true, this.state.accounts[0].address);
        else this.walletStorage.updateValue(false, "");
    }
}


var $f2b728861576b445$exports = {};

$parcel$export($f2b728861576b445$exports, "Algorand", () => $f2b728861576b445$export$2a2454b5976b73ac);

var $2062ba71daa80b8d$exports = {};

$parcel$export($2062ba71daa80b8d$exports, "WalletConnect", () => $2062ba71daa80b8d$export$ba0ef3a0d99fcc8f);









var $2062ba71daa80b8d$require$Buffer = $8zHUo$buffer.Buffer;
const $2062ba71daa80b8d$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $2062ba71daa80b8d$export$ba0ef3a0d99fcc8f {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, 
    ]);
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $b94377bbb94beb7e$export$2e84527d78ea64a4));
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$2062ba71daa80b8d$var$initialState
        };
        this.setupInitialState();
    }
    enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
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
            this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
            this.state.accounts = accounts;
            this.updateWalletStorageValue();
            this.hookRouter.applyHooks([
                (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
            ]);
        }
        this.provider.on("connect", (error, payload)=>{
            if (error) throw error;
            // Get provided accounts
            const { accounts: accounts  } = payload.params[0];
            this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
            this.state.accounts = accounts;
            this.updateWalletStorageValue();
            this.hookRouter.applyHooks([
                (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
            ]);
        });
        this.provider.on("disconnect", (error, payload)=>{
            if (error) throw error;
            this.signOut();
        });
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.state.accounts = [];
        this.state.isConnected = false;
        if (!this.provider) this.getProvider();
        try {
            await this.provider?.killSession();
        } catch (e) {}
        this.provider = undefined;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this.enforceIsConnected();
            const walletConnect = this.getProvider();
            const txnsToSign = transactions.map((txn)=>({
                    txn: $2062ba71daa80b8d$require$Buffer.from(txn).toString("base64")
                }));
            const jsonRpcRequest = (0, $8zHUo$jsonrpctoolsutils.formatJsonRpcRequest)("algo_signTxn", [
                txnsToSign
            ]);
            let signedTxns = await walletConnect.sendCustomRequest(jsonRpcRequest);
            let signedTxns2 = [];
            for(let i = 0; i < signedTxns.length; i++)if (signedTxns[i] !== null) signedTxns2.push({
                txID: "",
                blob: new Uint8Array($2062ba71daa80b8d$require$Buffer.from(signedTxns[i], "base64"))
            });
            else signedTxns2.push({
                txId: "",
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
            address: this.state.accounts[0],
            name: ""
        };
    }
    getAccounts() {
        return this.state.accounts.map((ob)=>({
                address: ob,
                name: ""
            }));
    }
    async fetchCurrentChainID() {
        return "0x1";
    }
    onAccountChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getPrimaryAccount());
        });
    }
    onChainChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    }
    onBlockAdded(cb) {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    toJSON() {
        return this.state;
    }
    getProvider() {
        if (this.provider instanceof (0, ($parcel$interopDefault($8zHUo$walletconnectclient)))) return this.provider;
        this.provider = new (0, ($parcel$interopDefault($8zHUo$walletconnectclient)))({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: (0, ($parcel$interopDefault($8zHUo$algorandwalletconnectqrcodemodal)))
        });
        return this.provider;
    }
    setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this.state = {
            isConnected: this.getIsConnected(),
            accounts: [
                storageValue.account
            ]
        };
    }
    updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) this.walletStorage.updateValue(true, this.state.accounts[0], true);
        else this.walletStorage.updateValue(false, "", true);
    }
}


class $f2b728861576b445$export$2a2454b5976b73ac {
    constructor(data){
        this.myAlgo = new (0, $a75d728b25ccd0d3$export$6ab354d5c56bf95)(data?.myAlgo);
        this.walletConnect = new (0, $2062ba71daa80b8d$export$ba0ef3a0d99fcc8f)(data?.walletConnect);
    }
}



const $b94377bbb94beb7e$export$2e84527d78ea64a4 = "ALGORAND";
$parcel$exportWildcard($b94377bbb94beb7e$exports, $a75d728b25ccd0d3$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $f2b728861576b445$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $2062ba71daa80b8d$exports);


var $fc578d3576b0d8ef$exports = {};
var $ff033dcd1750fc9d$exports = {};

$parcel$export($ff033dcd1750fc9d$exports, "useWindow", () => $ff033dcd1750fc9d$export$24b8fbafc4b6a151);
const $ff033dcd1750fc9d$export$24b8fbafc4b6a151 = (cb)=>{
    if (Object.keys(globalThis).includes("window")) return cb(globalThis.window);
    else return null;
};


$parcel$exportWildcard($fc578d3576b0d8ef$exports, $ff033dcd1750fc9d$exports);



const $430794692bff5f59$var$STORAGE_KEY = "wallet-state-storage";
class $430794692bff5f59$var$WalletStateStorage {
    constructor(chain){
        this.chain = chain;
        this.storage = this._storage();
    }
    getValue() {
        const value = this.values().find((state)=>state.chain === this.chain) || null;
        if (value && !this.isValidAddress(value.account)) return {
            isConnected: false,
            account: "",
            chain: this.chain,
            walletconnect: false
        };
        return value;
    }
    updateValue(isConnected, account, walletconnect = false) {
        const exisitingValues = this.getValue();
        let values = this.values();
        if (exisitingValues) values = values.map((value)=>{
            if (value.chain === this.chain) return {
                chain: this.chain,
                isConnected: isConnected,
                account: account,
                walletconnect: walletconnect
            };
            return value;
        });
        else values = values.concat({
            chain: this.chain,
            isConnected: isConnected,
            account: account,
            walletconnect: walletconnect
        });
        this.storage?.setItem($430794692bff5f59$var$STORAGE_KEY, JSON.stringify(values));
    }
    isValidAddress(account) {
        switch(this.chain){
            case 0, $be737fe08c02d508$export$aef6a8518da1f60c:
                return (0, $8zHUo$etherslibutils.isAddress)(account);
            case 0, $b94377bbb94beb7e$export$2e84527d78ea64a4:
                return (0, $8zHUo$algosdk.isValidAddress)(account);
            default:
                return false;
        }
    }
    values() {
        const values = this._storage()?.getItem($430794692bff5f59$var$STORAGE_KEY);
        return values ? JSON.parse(values) : [];
    }
    _storage() {
        return (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.localStorage);
    }
}
var $430794692bff5f59$export$2e2bcd8739ae039 = $430794692bff5f59$var$WalletStateStorage;




const $2ea60662ee21d00c$export$92de899abf5da75a = {
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
const $2ea60662ee21d00c$export$abdf78135f8407bb = {
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
const $2ea60662ee21d00c$export$703a843624f42e6c = (chainId)=>{
    switch(chainId){
        case 1:
            return $2ea60662ee21d00c$export$abdf78135f8407bb;
        case 4:
            return $2ea60662ee21d00c$export$92de899abf5da75a;
        default:
            throw new Error(`ChainId ${chainId} configuration not found`);
    }
};


const $2b09ea9ee8d63ad1$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $2b09ea9ee8d63ad1$export$2c78a3b4fc11d8fa {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, 
    ]);
    chain = null;
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $be737fe08c02d508$export$aef6a8518da1f60c));
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$2b09ea9ee8d63ad1$var$initialState
        };
        this.setupInitialState();
    }
    async _getProvider() {
        const ethereum = await (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)(async (windowObject)=>windowObject.ethereum);
        if (!Boolean(ethereum)) throw new (0, $d083fd37dae77b99$export$72563c16b91dfd16)();
        return new (0, $8zHUo$ethers.ethers).providers.Web3Provider(ethereum);
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
    async init() {
        this.provider = await this._getProvider();
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this.state.accounts = await provider.send("eth_requestAccounts", []);
        this.state.isConnected = this.state.accounts.length > 0;
        this.updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this.state.accounts);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        this.updateWalletStorageValue();
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
        const provider = this.provider || await this._getProvider();
        const balance = await provider.getBalance(this.state.accounts[0]);
        return balance.toString();
    }
    async getAssets() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    getIsConnected() {
        return this.state.isConnected;
    }
    getIsWalletInstalled() {
        const ethereum = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
        return Boolean(ethereum);
    }
    getPrimaryAccount() {
        this._enforceChain();
        this._enforceIsConnected();
        return this.state.accounts[0];
    }
    getAccounts() {
        this._enforceChain();
        this._enforceIsConnected();
        return this.state.accounts;
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
                const chainConfig = (0, $2ea60662ee21d00c$export$703a843624f42e6c)(chain);
                await this.addChainToWallet(chainConfig);
            } else throw err;
        }
    }
    async forceCurrentChainID(chain) {
        if (this.chain !== null && this.chain !== `0x${chain}`) throw new Error(`Cannot force chain to be 0x${chain} because it is already forced to be 0x${this.chain}`);
        this.chain = `0x${chain}`;
        this.switchChainFromWallet(chain);
    }
    onAccountChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    }
    onChainChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    }
    onAccountDisconnect(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    }
    onChainDisconnect(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT, cb);
    }
    onBlockAdded(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, (block)=>{
            return cb(block);
        });
    }
    toJSON() {
        return this.state;
    }
    async mountEventListeners() {
        const provider = await this._getProvider();
        if (typeof window !== "undefined" && "ethereum" in window) {
            const ethereum = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((window)=>window.ethereum);
            if (ethereum.on) {
                ethereum.on("accountsChanged", async (accounts)=>{
                    this.state.accounts = accounts;
                    if (accounts.length === 0) await this.signOut();
                    else this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, accounts);
                    this.updateWalletStorageValue();
                });
                ethereum.on("chainChanged", async (chainId)=>{
                    this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, chainId);
                });
                ethereum.on("disconnect", async (err)=>{
                    this.hookRouter.applyHooks([
                        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT
                    ]);
                });
            }
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
    setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this.state = {
            isConnected: storageValue.isConnected,
            accounts: [
                storageValue.account
            ]
        };
    }
    updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) this.walletStorage.updateValue(true, this.state.accounts[0]);
        else this.walletStorage.updateValue(false, "");
    }
}


var $d5d3dec9ab4b7763$exports = {};

var $b4976c18f17a124b$exports = {};

$parcel$export($b4976c18f17a124b$exports, "EthWalletConnect", () => $b4976c18f17a124b$export$9741c3aebc6a0fb7);





const $75b5db72ee15c73c$export$92de899abf5da75a = {
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
const $75b5db72ee15c73c$export$abdf78135f8407bb = {
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
const $75b5db72ee15c73c$export$703a843624f42e6c = (chainId)=>{
    switch(chainId){
        case 1:
            return $75b5db72ee15c73c$export$abdf78135f8407bb;
        case 4:
            return $75b5db72ee15c73c$export$92de899abf5da75a;
        default:
            throw new Error(`ChainId ${chainId} configuration not found`);
    }
};





const $b4976c18f17a124b$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $b4976c18f17a124b$export$9741c3aebc6a0fb7 {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, 
    ]);
    chain = null;
    walletStorage = new (0, $430794692bff5f59$export$2e2bcd8739ae039)((0, $be737fe08c02d508$export$aef6a8518da1f60c));
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$b4976c18f17a124b$var$initialState
        };
    }
    async _getProvider() {
        const walletConnectProvider = new (0, ($parcel$interopDefault($8zHUo$walletconnectweb3provider)))({
            infuraId: "f83857b162d64708b25a59585f969fbd",
            qrcode: true
        });
        await walletConnectProvider.enable();
        return new (0, $8zHUo$ethers.providers).Web3Provider(walletConnectProvider);
    }
    async _getWeb3Provider() {
        const ethereum = await (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)(async (windowObject)=>windowObject.ethereum);
        if (!Boolean(ethereum)) throw new (0, $d083fd37dae77b99$export$72563c16b91dfd16)();
        return new (0, $8zHUo$ethers.ethers).providers.Web3Provider(ethereum);
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
    }
    async _enforceChain() {
        if (this.chain === null) return;
        const provider = await this._getWeb3Provider();
        const currentChain = await provider.send("eth_chainId", []);
        if (currentChain !== this.chain) throw new Error(`Chain has changed to ${currentChain} when it should be ${this.chain}`);
    }
    async init() {
        this.provider = await this._getProvider();
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this.state.accounts = await provider.listAccounts(); //await provider.send("eth_requestAccounts", []);
        this.state.isConnected = this.state.accounts.length > 0;
        this.updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this.state.accounts);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        this.provider = undefined;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    // public async getSigner(): Promise<WalletConnectSigner> {
    //   return async (
    //     transactions: TransactionRequest[]
    //   ): Promise<TransactionResponse[]> => {
    //     this._enforceChain();
    //     this._enforceIsConnected();
    //     const provider = this.provider || (await this._getProvider());
    //     const transactionResponse = await provider
    //       .getSigner()
    //       .sendTransaction(transactions[0]);
    //     return [transactionResponse];
    //   };
    // }
    async getSigner() {
        this._enforceChain();
        this._enforceIsConnected();
        const provider = this.provider || await this._getProvider();
        return provider.getSigner();
    }
    async getBalance() {
        this._enforceChain();
        this._enforceIsConnected();
        const provider = await this._getWeb3Provider();
        const balance = await provider.getBalance(this.state.accounts[0]);
        return "12000000"; //balance.toString();
    }
    async getAssets() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    getIsConnected() {
        return this.state.isConnected;
    }
    getIsWalletInstalled() {
        const ethereum = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
        return Boolean(ethereum);
    }
    getPrimaryAccount() {
        this._enforceChain();
        this._enforceIsConnected();
        // return this.state.accounts[0];
        return {
            address: this.state.accounts[0],
            name: ""
        };
    }
    getAccounts() {
        this._enforceChain();
        this._enforceIsConnected();
        return this.state.accounts;
    }
    async fetchCurrentChainID() {
        const provider = await this._getWeb3Provider();
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
                const chainConfig = (0, $75b5db72ee15c73c$export$703a843624f42e6c)(chain);
                await this.addChainToWallet(chainConfig);
            } else throw err;
        }
    }
    async forceCurrentChainID(chain) {
        if (this.chain !== null && this.chain !== `0x${chain}`) throw new Error(`Cannot force chain to be 0x${chain} because it is already forced to be 0x${this.chain}`);
        this.chain = `0x${chain}`;
        this.switchChainFromWallet(chain);
    }
    onAccountChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    }
    onChainChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    }
    onAccountDisconnect(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    }
    onChainDisconnect(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT, cb);
    }
    onBlockAdded(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, (block)=>{
            return cb(block);
        });
    }
    toJSON() {
        return this.state;
    }
    async mountEventListeners() {
    // const provider = await this._getProvider();
    // console.log("mountEventListeners")
    // provider.on("connect", ((error, payload) => {
    //   if (error) {
    //     throw error;
    //   }
    //   console.log("run on mountEventListeners");
    //   // Get provided accounts
    //   const { accounts } = payload.params[0];
    //   this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
    //   this.state.accounts = accounts;
    //   this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    // }));
    // if (typeof window !== "undefined" && "ethereum" in window) {
    //   const ethereum = useWindow((window: any) => window.ethereum);
    //   if(ethereum.on) {
    //     ethereum.on("accountsChanged", async (accounts: string[]) => {
    //       this.state.accounts = accounts;
    //       if (accounts.length === 0) {
    //         await this.signOut();
    //       } else {
    //         this.hookRouter.applyHookWithArgs(
    //           WALLET_HOOK.ACCOUNT_ON_CHANGE,
    //           accounts
    //         );
    //       }
    //     });
    //     ethereum.on("chainChanged", async (chainId: string) => {
    //       this.hookRouter.applyHookWithArgs(WALLET_HOOK.CHAIN_ON_CHANGE, chainId);
    //     });
    //     ethereum.on("disconnect", async (err: Error) => {
    //       this.hookRouter.applyHooks([WALLET_HOOK.CHAIN_ON_DISCONNECT]);
    //     });
    //   }
    // }
    // provider.on("block", (block: number) => {
    //   this.hookRouter.applyHookWithArgs(WALLET_HOOK.NEW_BLOCK, block);
    // });
    }
    async unmountEventListeners() {
    // const provider = await this._getProvider();
    // provider.removeAllListeners();
    }
    async getProvider() {
        await this._enforceChain();
        return await this._getProvider();
    }
    async getWeb3Provider() {
        return await this._getWeb3Provider();
    }
    updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) this.walletStorage.updateValue(true, this.state.accounts[0], true);
        else this.walletStorage.updateValue(false, "", true);
    }
}


class $d5d3dec9ab4b7763$var$Ethereum {
    constructor(data){
        this.metaMask = new (0, $2b09ea9ee8d63ad1$export$2c78a3b4fc11d8fa)(data?.metaMask);
        this.walletConnect = new (0, $b4976c18f17a124b$export$9741c3aebc6a0fb7)();
    }
}



const $be737fe08c02d508$export$aef6a8518da1f60c = "ETHEREUM";
$parcel$exportWildcard($be737fe08c02d508$exports, $2b09ea9ee8d63ad1$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $d5d3dec9ab4b7763$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $b4976c18f17a124b$exports);




$parcel$exportWildcard(module.exports, $faefaad95e5fcca0$exports);
$parcel$exportWildcard(module.exports, $d083fd37dae77b99$exports);
$parcel$exportWildcard(module.exports, $be737fe08c02d508$exports);
$parcel$exportWildcard(module.exports, $b94377bbb94beb7e$exports);
$parcel$exportWildcard(module.exports, $fc578d3576b0d8ef$exports);


//# sourceMappingURL=index.js.map
