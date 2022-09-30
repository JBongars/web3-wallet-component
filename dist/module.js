import {ethers as $hgUW1$ethers, providers as $hgUW1$providers} from "ethers";
import {isValidAddress as $hgUW1$isValidAddress} from "algosdk";
import {isAddress as $hgUW1$isAddress} from "ethers/lib/utils";
import $hgUW1$randlabsmyalgoconnect from "@randlabs/myalgo-connect";
import {formatJsonRpcRequest as $hgUW1$formatJsonRpcRequest} from "@json-rpc-tools/utils";
import $hgUW1$walletconnectclient from "@walletconnect/client";
import $hgUW1$algorandwalletconnectqrcodemodal from "algorand-walletconnect-qrcode-modal";
import {Buffer as $hgUW1$Buffer} from "buffer";
import {PeraWalletConnect as $hgUW1$PeraWalletConnect} from "@perawallet/connect";
import $hgUW1$walletconnectweb3provider from "@walletconnect/web3-provider";

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
var $81c1b644006d48ec$exports = {};


var $28ac839a9eca26f5$exports = {};

$parcel$export($28ac839a9eca26f5$exports, "NotImplementedError", () => $28ac839a9eca26f5$export$e162153238934121);
$parcel$export($28ac839a9eca26f5$exports, "WalletNotInstalledError", () => $28ac839a9eca26f5$export$72563c16b91dfd16);
$parcel$export($28ac839a9eca26f5$exports, "WalletNotConnectedError", () => $28ac839a9eca26f5$export$313d299817c74896);
$parcel$export($28ac839a9eca26f5$exports, "HookNotAvailableError", () => $28ac839a9eca26f5$export$f4d277c155d1965e);
class $28ac839a9eca26f5$export$e162153238934121 extends Error {
    constructor(message = "NotImplementedError"){
        super(message);
        this.name = "NotImplementedError";
    }
}
class $28ac839a9eca26f5$export$72563c16b91dfd16 extends Error {
    constructor(message = "WalletNotInstalledError"){
        super(message);
        this.name = "WalletNotInstalledError";
    }
}
class $28ac839a9eca26f5$export$313d299817c74896 extends Error {
    constructor(message = "WalletNotConnectedError"){
        super(message);
        this.name = "WalletNotConnectedError";
    }
}
class $28ac839a9eca26f5$export$f4d277c155d1965e extends Error {
    constructor(message = "HookNotAvailableError"){
        super(message);
        this.name = "HookNotAvailableError";
    }
}


var $61dc865ce14f4bf4$exports = {};

$parcel$export($61dc865ce14f4bf4$exports, "CHAIN_ETHEREUM", () => $61dc865ce14f4bf4$export$aef6a8518da1f60c);
var $05db05568a951b86$exports = {};

$parcel$export($05db05568a951b86$exports, "Metamask", () => $05db05568a951b86$export$2c78a3b4fc11d8fa);



class $826e60e3117e96ce$var$HookRouter {
    constructor(hooks){
        this.hooks = new Map();
        this.availableHooks = hooks;
        this.resetAllHooks();
    }
    checkIfValidHook(hook) {
        if (!this.hooks.has(hook)) throw new (0, $28ac839a9eca26f5$export$f4d277c155d1965e)();
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
var $826e60e3117e96ce$export$2e2bcd8739ae039 = $826e60e3117e96ce$var$HookRouter;


let $90bab4f8b8f7e96d$export$de76a1f31766a0a2;
(function(WALLET_STATUS1) {
    WALLET_STATUS1[WALLET_STATUS1["OK"] = 0] = "OK";
    WALLET_STATUS1[WALLET_STATUS1["LOGIN_ERROR"] = 1] = "LOGIN_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["WALLET_ERROR"] = 2] = "WALLET_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["EXTENSION_NOT_FOUND"] = 3] = "EXTENSION_NOT_FOUND";
    WALLET_STATUS1[WALLET_STATUS1["ACCOUNT_NOT_FOUND"] = 4] = "ACCOUNT_NOT_FOUND";
})($90bab4f8b8f7e96d$export$de76a1f31766a0a2 || ($90bab4f8b8f7e96d$export$de76a1f31766a0a2 = {}));
let $90bab4f8b8f7e96d$export$7c460c214963f696;
(function(WALLET_ID1) {
    WALLET_ID1[WALLET_ID1["ETHEREUM_METAMASK"] = 1] = "ETHEREUM_METAMASK";
    WALLET_ID1[WALLET_ID1["ALGORAND_MYALGO"] = 2] = "ALGORAND_MYALGO";
    WALLET_ID1[WALLET_ID1["ALGORAND_WALLETCONNECT"] = 3] = "ALGORAND_WALLETCONNECT";
    WALLET_ID1[WALLET_ID1["ETHEREUM_WALLETCONNECT"] = 4] = "ETHEREUM_WALLETCONNECT";
    WALLET_ID1[WALLET_ID1["ALGORAND_PERAWALLET"] = 5] = "ALGORAND_PERAWALLET";
})($90bab4f8b8f7e96d$export$7c460c214963f696 || ($90bab4f8b8f7e96d$export$7c460c214963f696 = {}));
let $90bab4f8b8f7e96d$export$5ee9bf08a91850b9;
(function(WALLET_HOOK1) {
    WALLET_HOOK1[WALLET_HOOK1["CHAIN_ON_CHANGE"] = 0] = "CHAIN_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["CHAIN_ON_DISCONNECT"] = 1] = "CHAIN_ON_DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_CHANGE"] = 2] = "ACCOUNT_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_DISCONNECT"] = 3] = "ACCOUNT_ON_DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["NEW_BLOCK"] = 4] = "NEW_BLOCK";
    WALLET_HOOK1[WALLET_HOOK1["CONNECT"] = 5] = "CONNECT";
})($90bab4f8b8f7e96d$export$5ee9bf08a91850b9 || ($90bab4f8b8f7e96d$export$5ee9bf08a91850b9 = {}));




var $dc4d60a7eb431eef$exports = {};

$parcel$export($dc4d60a7eb431eef$exports, "CHAIN_ALGORAND", () => $dc4d60a7eb431eef$export$2e84527d78ea64a4);
var $0e4707f80e4e0187$exports = {};

$parcel$export($0e4707f80e4e0187$exports, "MyAlgo", () => $0e4707f80e4e0187$export$6ab354d5c56bf95);






var $b5af4601982a5fe5$exports = {};

$parcel$export($b5af4601982a5fe5$exports, "AlgorandWalletType", () => $b5af4601982a5fe5$export$69a7e0cc19186a57);
$parcel$export($b5af4601982a5fe5$exports, "Algorand", () => $b5af4601982a5fe5$export$2a2454b5976b73ac);

var $6a9b0d356171a818$exports = {};

$parcel$export($6a9b0d356171a818$exports, "WalletConnect", () => $6a9b0d356171a818$export$ba0ef3a0d99fcc8f);










var $6a9b0d356171a818$require$Buffer = $hgUW1$Buffer;
const $6a9b0d356171a818$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $6a9b0d356171a818$export$ba0ef3a0d99fcc8f {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, 
    ]);
    walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $dc4d60a7eb431eef$export$2e84527d78ea64a4), (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ALGORAND_WALLETCONNECT);
    type = (0, $b5af4601982a5fe5$export$69a7e0cc19186a57).ALGO_WALLET_CONNECT;
    name = "ALGO_WALLET_CONNECT";
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$6a9b0d356171a818$var$initialState
        };
        this.setupInitialState();
    }
    enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
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
            this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
            this.state.accounts = accounts;
            this.updateWalletStorageValue();
            this.hookRouter.applyHooks([
                (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
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
                (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
            ]);
        });
        this.provider.on("disconnect", (error, payload)=>{
            if (error) throw error;
            this.signOut();
        });
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
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
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this.enforceIsConnected();
            const walletConnect = this.getProvider();
            const txnsToSign = transactions.map((txn)=>({
                    txn: $6a9b0d356171a818$require$Buffer.from(txn).toString("base64")
                }));
            const jsonRpcRequest = (0, $hgUW1$formatJsonRpcRequest)("algo_signTxn", [
                txnsToSign
            ]);
            let signedTxns = await walletConnect.sendCustomRequest(jsonRpcRequest);
            let signedTxns2 = [];
            for(let i = 0; i < signedTxns.length; i++)if (signedTxns[i] !== null) signedTxns2.push({
                txID: "",
                blob: new Uint8Array($6a9b0d356171a818$require$Buffer.from(signedTxns[i], "base64"))
            });
            else signedTxns2.push({
                txId: "",
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
    async mountEventListeners() {}
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
    onBlockAdded = (cb)=>{
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    };
    toJSON() {
        return this.state;
    }
    getProvider() {
        if (this.provider instanceof (0, $hgUW1$walletconnectclient)) return this.provider;
        this.provider = new (0, $hgUW1$walletconnectclient)({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: (0, $hgUW1$algorandwalletconnectqrcodemodal)
        });
        return this.provider;
    }
    setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this.state = {
            isConnected: this.getIsConnected(),
            accounts: storageValue.accounts
        };
    }
    updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) {
            const accounts = this.getAccounts().map((acc)=>acc.address);
            const connectedAccount = this.getPrimaryAccount().address;
            this.walletStorage.updateValue(true, connectedAccount, accounts);
        } else this.walletStorage.updateValue(false, "", []);
    }
}


var $b5560c6a127e9264$exports = {};

$parcel$export($b5560c6a127e9264$exports, "PeraWallet", () => $b5560c6a127e9264$export$6a733d504587e4b0);








var $b5560c6a127e9264$require$Buffer = $hgUW1$Buffer;
const $b5560c6a127e9264$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $b5560c6a127e9264$export$6a733d504587e4b0 {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, 
    ]);
    walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $dc4d60a7eb431eef$export$2e84527d78ea64a4), (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ALGORAND_PERAWALLET);
    type = (0, $b5af4601982a5fe5$export$69a7e0cc19186a57).PERA_WALLET;
    name = "PERA_WALLET";
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$b5560c6a127e9264$var$initialState
        };
        this.setupInitialState();
    }
    enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
    }
    async init() {
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        this.provider = this.getProvider();
        const accounts = await this.provider.connect();
        this.state.accounts = accounts.map((account)=>({
                name: "",
                address: account
            }));
        this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        this.provider?.connector?.on("disconnect", (error, payload)=>{
            if (error) throw error;
            this.signOut();
        });
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.state.accounts = [];
        this.state.isConnected = false;
        if (!this.provider) this.provider = this.getProvider();
        if (!this.provider.connector) await this.provider.reconnectSession();
        try {
            await this.provider?.disconnect();
        } catch (e) {}
        this.provider = undefined;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this.enforceIsConnected();
            const peraWallet = this.getProvider();
            if (!peraWallet.connector) await peraWallet.reconnectSession();
            const txnsToSign = transactions.map((txn)=>({
                    txn: $b5560c6a127e9264$require$Buffer.from(txn).toString("base64")
                }));
            const jsonRpcRequest = (0, $hgUW1$formatJsonRpcRequest)("algo_signTxn", [
                txnsToSign
            ]);
            let signedTxns = await peraWallet?.connector?.sendCustomRequest(jsonRpcRequest);
            console.log({
                signedTxns: signedTxns
            });
            let signedTxns2 = [];
            for(let i = 0; i < signedTxns.length; i++)if (signedTxns[i] !== null) signedTxns2.push({
                txID: "",
                blob: new Uint8Array($b5560c6a127e9264$require$Buffer.from(signedTxns[i], "base64"))
            });
            else signedTxns2.push({
                txId: "",
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
        return this.state.accounts[0];
    }
    getAccounts() {
        return Array.isArray(this.state.accounts) ? this.state.accounts : [];
    }
    async fetchCurrentChainID() {
        return "0x1";
    }
    async mountEventListeners() {}
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
    onBlockAdded = (cb)=>{
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    };
    toJSON() {
        return this.state;
    }
    getProvider() {
        this.enforceIsConnected();
        if (this.provider instanceof (0, $hgUW1$PeraWalletConnect)) return this.provider;
        this.provider = new (0, $hgUW1$PeraWalletConnect)();
        return this.provider;
    }
    setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this.state = {
            isConnected: this.getIsConnected(),
            accounts: storageValue.accounts.map((account)=>({
                    name: "",
                    address: account
                }))
        };
    }
    updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) {
            const accounts = this.getAccounts().map((acc)=>acc.address);
            const connectedAccount = this.getPrimaryAccount().address;
            this.walletStorage.updateValue(true, connectedAccount, accounts);
        } else this.walletStorage.updateValue(false, "", []);
    }
}




let $b5af4601982a5fe5$export$69a7e0cc19186a57;
(function(AlgorandWalletType1) {
    AlgorandWalletType1[AlgorandWalletType1["MY_ALGO"] = 0] = "MY_ALGO";
    AlgorandWalletType1[AlgorandWalletType1["ALGO_WALLET_CONNECT"] = 1] = "ALGO_WALLET_CONNECT";
    AlgorandWalletType1[AlgorandWalletType1["PERA_WALLET"] = 2] = "PERA_WALLET";
})($b5af4601982a5fe5$export$69a7e0cc19186a57 || ($b5af4601982a5fe5$export$69a7e0cc19186a57 = {}));
class $b5af4601982a5fe5$export$2a2454b5976b73ac {
    _initialized = false;
    _activeWallets = [];
    constructor(data, defaultWallet = $b5af4601982a5fe5$export$69a7e0cc19186a57.MY_ALGO){
        this._myAlgo = new (0, $0e4707f80e4e0187$export$6ab354d5c56bf95)(data?.myAlgo);
        this._walletConnect = new (0, $6a9b0d356171a818$export$ba0ef3a0d99fcc8f)(data?.walletConnect);
        this._peraWallet = new (0, $b5560c6a127e9264$export$6a733d504587e4b0)(data?.peraWallet);
        this._defaultWallet = defaultWallet;
    }
    _registerActiveWallet = (type)=>{
        this._activeWallets.push(type);
    };
    _deregisterActiveWallet = (type)=>{
        this._activeWallets = this._activeWallets.filter((elem)=>elem !== type);
    };
    _initAlgorandWallet = (algoWallet)=>{
        const onAccountChange = (accounts)=>{
            if (accounts.length < 1) this._deregisterActiveWallet(algoWallet.type);
            else this._registerActiveWallet(algoWallet.type);
        };
        const onAccountDisconnect = ()=>{
            this._deregisterActiveWallet(algoWallet.type);
        };
        if (algoWallet.getIsWalletInstalled()) {
            algoWallet.init();
            algoWallet.onAccountChange(onAccountChange);
            algoWallet.onAccountDisconnect(onAccountDisconnect);
        } else console.warn("Selected algorand wallet is not currently installed...");
        return algoWallet;
    };
    async init() {
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
            case $b5af4601982a5fe5$export$69a7e0cc19186a57.MY_ALGO:
                return this._myAlgo;
            case $b5af4601982a5fe5$export$69a7e0cc19186a57.ALGO_WALLET_CONNECT:
                return this._walletConnect;
            case $b5af4601982a5fe5$export$69a7e0cc19186a57.PERA_WALLET:
                return this._peraWallet;
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }
    getActiveWallet() {
        if (this._activeWallets.length === 0) return this.getWallet(this._defaultWallet); // Get default wallet
        return this.getWallet(this._activeWallets[0]);
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
    onAccountChange(cb) {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    onChainChange(cb) {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    onBlockAdded(cb) {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    toJSON() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
}


const $0e4707f80e4e0187$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $0e4707f80e4e0187$export$6ab354d5c56bf95 {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, 
    ]);
    walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $dc4d60a7eb431eef$export$2e84527d78ea64a4), (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ALGORAND_MYALGO);
    currentActiveAccountAddress = "";
    type = (0, $b5af4601982a5fe5$export$69a7e0cc19186a57).MY_ALGO;
    name = "MY_ALGO";
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$0e4707f80e4e0187$var$initialState
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
        const account = this.state.accounts.find((acc)=>acc.address === address);
        if (account) this.currentActiveAccountAddress = account.address;
        this.updateWalletStorageValue();
    }
    setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) {
            this.state = {
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
        if (this.state.isConnected && this.state.accounts.length > 0) {
            const accounts = this.getAccounts().map((acc)=>acc.address);
            const connectedAccount = this.getPrimaryAccount().address;
            this.walletStorage.updateValue(true, connectedAccount, accounts);
        } else this.walletStorage.updateValue(false, "", []);
    }
    async signIn() {
        const myAlgoConnect = this.getProvider();
        // forces user to only choose one account.
        // This prevents a lot of edge cases.
        this.state.accounts = await myAlgoConnect.connect();
        this.state.isConnected = this.state.accounts.length > 0;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
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
        return this.state.isConnected;
    }
    getPrimaryAccount() {
        if (!this.getIsConnected()) return {
            name: "",
            address: ""
        };
        const account = this.state.accounts.find((acc)=>acc.address === this.currentActiveAccountAddress);
        if (this.currentActiveAccountAddress && account) return account;
        return this.state.accounts[0];
    }
    getAccounts() {
        return this.state.accounts;
    }
    async fetchCurrentChainID() {
        return "0x1";
    }
    async mountEventListeners() {}
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
    onBlockAdded = (cb)=>{
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    };
    toJSON() {
        return this.state;
    }
}





const $dc4d60a7eb431eef$export$2e84527d78ea64a4 = "ALGORAND";
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $0e4707f80e4e0187$exports);
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $b5af4601982a5fe5$exports);
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $6a9b0d356171a818$exports);
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $b5560c6a127e9264$exports);


var $8c78a71587639d7a$exports = {};
var $412a545945027ba9$exports = {};

$parcel$export($412a545945027ba9$exports, "useWindow", () => $412a545945027ba9$export$24b8fbafc4b6a151);
const $412a545945027ba9$export$24b8fbafc4b6a151 = (cb)=>{
    if (Object.keys(globalThis).includes("window")) return cb(globalThis.window);
    else return null;
};


$parcel$exportWildcard($8c78a71587639d7a$exports, $412a545945027ba9$exports);



const $3b49e6787d3f4e23$var$STORAGE_KEY = "wallet-state-storage";
class $3b49e6787d3f4e23$var$WalletStateStorage {
    constructor(chain, walletId){
        this.chain = chain;
        this.walletId = walletId;
        this.storage = this._storage();
    }
    getValue() {
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
    updateValue(isConnected, connectedAccount, accounts) {
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
    isValidAddress(account) {
        switch(this.chain){
            case 0, $61dc865ce14f4bf4$export$aef6a8518da1f60c:
                return (0, $hgUW1$isAddress)(account);
            case 0, $dc4d60a7eb431eef$export$2e84527d78ea64a4:
                return (0, $hgUW1$isValidAddress)(account);
            default:
                return false;
        }
    }
    values() {
        const values = this._storage()?.getItem($3b49e6787d3f4e23$var$STORAGE_KEY);
        return values ? JSON.parse(values) : [];
    }
    _storage() {
        return (0, $412a545945027ba9$export$24b8fbafc4b6a151)((windowObject)=>windowObject.localStorage);
    }
}
var $3b49e6787d3f4e23$export$2e2bcd8739ae039 = $3b49e6787d3f4e23$var$WalletStateStorage;




const $40eed140bd70c71c$export$92de899abf5da75a = {
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
const $40eed140bd70c71c$export$abdf78135f8407bb = {
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
const $40eed140bd70c71c$export$703a843624f42e6c = (chainId)=>{
    switch(chainId){
        case 1:
            return $40eed140bd70c71c$export$abdf78135f8407bb;
        case 4:
            return $40eed140bd70c71c$export$92de899abf5da75a;
        default:
            throw new Error(`ChainId ${chainId} configuration not found`);
    }
};


const $05db05568a951b86$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $05db05568a951b86$export$2c78a3b4fc11d8fa {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK, 
    ]);
    chain = null;
    walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $61dc865ce14f4bf4$export$aef6a8518da1f60c), (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ETHEREUM_METAMASK);
    name = "METAMASK";
    type = (0, $85bc198bca370cae$export$1fff2d5bc1c704ba).METMASK;
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$05db05568a951b86$var$initialState
        };
        this.setupInitialState();
    }
    async _getProvider() {
        const ethereum = await (0, $412a545945027ba9$export$24b8fbafc4b6a151)(async (windowObject)=>windowObject.ethereum);
        if (!Boolean(ethereum)) throw new (0, $28ac839a9eca26f5$export$72563c16b91dfd16)();
        return new (0, $hgUW1$ethers).providers.Web3Provider(ethereum);
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
    }
    async _enforceChain() {
        if (this.chain === null) return;
        const provider = await this._getProvider();
        const currentChain = await provider.send("eth_chainId", []);
        if (currentChain !== this.chain) throw new Error(`Chain has changed to ${currentChain} when it should be ${this.chain}`);
    }
    async init() {
        this.provider = await this._getProvider();
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this.state.accounts = await provider.send("eth_requestAccounts", []);
        this.state.isConnected = this.state.accounts.length > 0;
        this.updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this.state.accounts);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        this.updateWalletStorageValue();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
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
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    getIsConnected() {
        return this.state.isConnected;
    }
    getIsWalletInstalled() {
        const ethereum = (0, $412a545945027ba9$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
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
        return (0, $412a545945027ba9$export$24b8fbafc4b6a151)(async (window)=>window.ethereum?.request({
                method: "wallet_addEthereumChain",
                params: [
                    chainConfig
                ]
            }));
    }
    async switchChainFromWallet(chain) {
        const ethereum = (0, $412a545945027ba9$export$24b8fbafc4b6a151)((window)=>window.ethereum);
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
                const chainConfig = (0, $40eed140bd70c71c$export$703a843624f42e6c)(chain);
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
    toJSON() {
        return this.state;
    }
    async mountEventListeners() {
        const provider = await this._getProvider();
        if (typeof window !== "undefined" && "ethereum" in window) {
            const ethereum = (0, $412a545945027ba9$export$24b8fbafc4b6a151)((window)=>window.ethereum);
            if (ethereum.on) {
                ethereum.on("accountsChanged", async (accounts)=>{
                    this.state.accounts = ethereum.request({
                        method: "eth_requestAccounts"
                    });
                    if (accounts.length === 0) await this.signOut();
                    else this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, accounts);
                    this.updateWalletStorageValue();
                });
                ethereum.on("chainChanged", async (chainId)=>{
                    this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, chainId);
                });
                ethereum.on("disconnect", async (err)=>{
                    this.hookRouter.applyHooks([
                        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT
                    ]);
                });
            }
        }
        provider.on("block", (block)=>{
            this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK, block);
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
            accounts: storageValue.accounts
        };
    }
    updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) this.walletStorage.updateValue(true, this.getPrimaryAccount(), this.state.accounts);
        else this.walletStorage.updateValue(false, "", []);
    }
}


var $85bc198bca370cae$exports = {};

$parcel$export($85bc198bca370cae$exports, "EthereumWalletType", () => $85bc198bca370cae$export$1fff2d5bc1c704ba);
$parcel$export($85bc198bca370cae$exports, "Ethereum", () => $85bc198bca370cae$export$aa318bacd7f710c5);

var $b82f469e02efa91a$exports = {};

$parcel$export($b82f469e02efa91a$exports, "EthWalletConnect", () => $b82f469e02efa91a$export$9741c3aebc6a0fb7);





const $5296101650666d42$export$92de899abf5da75a = {
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
const $5296101650666d42$export$abdf78135f8407bb = {
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
const $5296101650666d42$export$703a843624f42e6c = (chainId)=>{
    switch(chainId){
        case 1:
            return $5296101650666d42$export$abdf78135f8407bb;
        case 4:
            return $5296101650666d42$export$92de899abf5da75a;
        default:
            throw new Error(`ChainId ${chainId} configuration not found`);
    }
};





const $b82f469e02efa91a$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $b82f469e02efa91a$export$9741c3aebc6a0fb7 {
    hookRouter = new (0, $826e60e3117e96ce$export$2e2bcd8739ae039)([
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT,
        (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK, 
    ]);
    chain = null;
    walletStorage = new (0, $3b49e6787d3f4e23$export$2e2bcd8739ae039)((0, $61dc865ce14f4bf4$export$aef6a8518da1f60c), (0, $90bab4f8b8f7e96d$export$7c460c214963f696).ETHEREUM_WALLETCONNECT);
    name = "WALLET_CONNECT";
    type = (0, $85bc198bca370cae$export$1fff2d5bc1c704ba).ETH_WALLET_CONNECT;
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$b82f469e02efa91a$var$initialState
        };
        this.setupInitialState();
    }
    async _getProvider() {
        const provider = await this.getWCProvider();
        return new (0, $hgUW1$providers).Web3Provider(provider);
    }
    _enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
    }
    async _enforceChain() {
        if (this.chain === null) return;
        const provider = await this._getProvider();
        const currentChain = await provider.send("eth_chainId", []);
        if (currentChain !== this.chain) throw new Error(`Chain has changed to ${currentChain} when it should be ${this.chain}`);
    }
    async getWCProvider() {
        const walletConnectProvider = new (0, $hgUW1$walletconnectweb3provider)({
            infuraId: "f83857b162d64708b25a59585f969fbd",
            qrcode: true
        });
        await walletConnectProvider.enable();
        return walletConnectProvider;
    }
    async init() {
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this._getProvider();
        this.state.accounts = await provider.listAccounts();
        this.state.isConnected = this.state.accounts.length > 0;
        this.updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this.state.accounts);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        this.provider = undefined;
        this.updateWalletStorageValue();
        (await this.getWCProvider()).disconnect();
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
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
        const balance = await provider.getBalance(this.state.accounts[0]);
        return balance.toString();
    }
    async getAssets() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    getIsConnected() {
        return this.state.isConnected;
    }
    getIsWalletInstalled() {
        const ethereum = (0, $412a545945027ba9$export$24b8fbafc4b6a151)((windowObject)=>windowObject.ethereum);
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
        return (0, $412a545945027ba9$export$24b8fbafc4b6a151)(async (window)=>window.ethereum?.request({
                method: "wallet_addEthereumChain",
                params: [
                    chainConfig
                ]
            }));
    }
    async switchChainFromWallet(chain) {
        const ethereum = (0, $412a545945027ba9$export$24b8fbafc4b6a151)((window)=>window.ethereum);
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
                const chainConfig = (0, $5296101650666d42$export$703a843624f42e6c)(chain);
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
    toJSON() {
        return this.state;
    }
    async mountEventListeners() {}
    async unmountEventListeners() {}
    async getProvider() {
        await this._enforceChain();
        return await this._getProvider();
    }
    setupInitialState() {
        const storageValue = this.walletStorage.getValue();
        if (storageValue) this.state = {
            isConnected: storageValue.isConnected,
            accounts: storageValue.accounts
        };
    }
    updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) this.walletStorage.updateValue(true, this.state.accounts[0], this.state.accounts);
        else this.walletStorage.updateValue(false, "", []);
    }
}




let $85bc198bca370cae$export$1fff2d5bc1c704ba;
(function(EthereumWalletType1) {
    EthereumWalletType1[EthereumWalletType1["METMASK"] = 0] = "METMASK";
    EthereumWalletType1[EthereumWalletType1["ETH_WALLET_CONNECT"] = 1] = "ETH_WALLET_CONNECT";
})($85bc198bca370cae$export$1fff2d5bc1c704ba || ($85bc198bca370cae$export$1fff2d5bc1c704ba = {}));
class $85bc198bca370cae$export$aa318bacd7f710c5 {
    _initialized = false;
    _activeWallets = [];
    constructor(data, defaultWallet = $85bc198bca370cae$export$1fff2d5bc1c704ba.METMASK){
        this._metaMask = new (0, $05db05568a951b86$export$2c78a3b4fc11d8fa)(data?.metaMask);
        this._walletConnect = new (0, $b82f469e02efa91a$export$9741c3aebc6a0fb7)();
        this._defaultWallet = defaultWallet;
    }
    _registerActiveWallet = (type)=>{
        this._activeWallets.push(type);
    };
    _deregisterActiveWallet = (type)=>{
        const index = this._activeWallets.indexOf(type);
        this._activeWallets = this._activeWallets.splice(index, 1);
    };
    _initEthereumWallet = async (wallet)=>{
        const onAccountChange = (accounts)=>{
            if (accounts.length < 1) this._deregisterActiveWallet(wallet.type);
            else this._registerActiveWallet(wallet.type);
        };
        const onAccountDisconnect = ()=>{
            this._deregisterActiveWallet(wallet.type);
        };
        if (wallet.getIsWalletInstalled()) {
            await wallet.init();
            await wallet.mountEventListeners();
            wallet.onAccountChange(onAccountChange);
            wallet.onAccountDisconnect(onAccountDisconnect);
        } else console.warn(`${wallet.name} is not currently installed...`);
    };
    async init() {
        if (this._initialized) return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
        await Promise.all([
            this._metaMask,
            this._walletConnect
        ].map(this._initEthereumWallet));
        this._initialized = true;
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    getWallet(type) {
        switch(type){
            case $85bc198bca370cae$export$1fff2d5bc1c704ba.ETH_WALLET_CONNECT:
                return this._walletConnect;
            case $85bc198bca370cae$export$1fff2d5bc1c704ba.METMASK:
                return this._metaMask;
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }
    getActiveWallet() {
        if (this._activeWallets.length === 0) return this.getWallet(this._defaultWallet); // Get default wallet
        return this.getWallet(this._activeWallets[0]);
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
    onAccountChange(cb) {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    onChainChange(cb) {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    onBlockAdded(cb) {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    toJSON() {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
}



const $61dc865ce14f4bf4$export$aef6a8518da1f60c = "ETHEREUM";
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $05db05568a951b86$exports);
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $85bc198bca370cae$exports);
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $b82f469e02efa91a$exports);






export {$61dc865ce14f4bf4$export$aef6a8518da1f60c as CHAIN_ETHEREUM, $05db05568a951b86$export$2c78a3b4fc11d8fa as Metamask, $85bc198bca370cae$export$1fff2d5bc1c704ba as EthereumWalletType, $85bc198bca370cae$export$aa318bacd7f710c5 as Ethereum, $b82f469e02efa91a$export$9741c3aebc6a0fb7 as EthWalletConnect, $dc4d60a7eb431eef$export$2e84527d78ea64a4 as CHAIN_ALGORAND, $0e4707f80e4e0187$export$6ab354d5c56bf95 as MyAlgo, $b5af4601982a5fe5$export$69a7e0cc19186a57 as AlgorandWalletType, $b5af4601982a5fe5$export$2a2454b5976b73ac as Algorand, $6a9b0d356171a818$export$ba0ef3a0d99fcc8f as WalletConnect, $b5560c6a127e9264$export$6a733d504587e4b0 as PeraWallet, $412a545945027ba9$export$24b8fbafc4b6a151 as useWindow, $28ac839a9eca26f5$export$e162153238934121 as NotImplementedError, $28ac839a9eca26f5$export$72563c16b91dfd16 as WalletNotInstalledError, $28ac839a9eca26f5$export$313d299817c74896 as WalletNotConnectedError, $28ac839a9eca26f5$export$f4d277c155d1965e as HookNotAvailableError};
//# sourceMappingURL=module.js.map
