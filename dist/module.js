import {ethers as $hgUW1$ethers} from "ethers";
import $hgUW1$randlabsmyalgoconnect from "@randlabs/myalgo-connect";

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

$parcel$export($81c1b644006d48ec$exports, "WALLETS", () => $81c1b644006d48ec$export$412a02074a4127ac);
const $81c1b644006d48ec$export$412a02074a4127ac = {
    MYALGO: "MYALGO",
    METAMASK: "METAMASK"
};


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
var $05db05568a951b86$exports = {};

$parcel$export($05db05568a951b86$exports, "Metamask", () => $05db05568a951b86$export$2c78a3b4fc11d8fa);

var $8c78a71587639d7a$exports = {};
var $412a545945027ba9$exports = {};

$parcel$export($412a545945027ba9$exports, "useWindow", () => $412a545945027ba9$export$24b8fbafc4b6a151);
const $412a545945027ba9$export$24b8fbafc4b6a151 = (cb)=>{
    if (Object.keys(globalThis).includes("window")) return cb(globalThis.window);
    else return null;
};


$parcel$exportWildcard($8c78a71587639d7a$exports, $412a545945027ba9$exports);




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
let $90bab4f8b8f7e96d$export$5ee9bf08a91850b9;
(function(WALLET_HOOK1) {
    WALLET_HOOK1[WALLET_HOOK1["CHAIN_ON_CHANGE"] = 0] = "CHAIN_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["CHAIN_ON_DISCONNECT"] = 1] = "CHAIN_ON_DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_CHANGE"] = 2] = "ACCOUNT_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_DISCONNECT"] = 3] = "ACCOUNT_ON_DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["NEW_BLOCK"] = 4] = "NEW_BLOCK";
})($90bab4f8b8f7e96d$export$5ee9bf08a91850b9 || ($90bab4f8b8f7e96d$export$5ee9bf08a91850b9 = {}));


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
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$05db05568a951b86$var$initialState
        };
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
        this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, this.state.accounts);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this._enforceChain();
            this._enforceIsConnected();
            const provider = this.provider || await this._getProvider();
            const transactionResponse = await provider.getSigner().sendTransaction(transactions[0]);
            return [
                transactionResponse
            ];
        };
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
    onAccountChange(cb) {
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, cb);
    }
    onChainChange(cb) {
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
    }
    onAccountDisconnect(cb) {
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_DISCONNECT, cb);
    }
    onChainDisconnect(cb) {
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_DISCONNECT, cb);
    }
    onBlockAdded(cb) {
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).NEW_BLOCK, (block)=>{
            return cb(block);
        });
    }
    toJSON() {
        return this.state;
    }
    async mountEventListeners() {
        const provider = await this._getProvider();
        
        if (window.ethereum) {
            const ethereum = (0, $412a545945027ba9$export$24b8fbafc4b6a151)((window)=>window.ethereum);
            ethereum.on("accountsChanged", async (accounts)=>{
                this.state.accounts = accounts;
                if (accounts.length === 0) await this.signOut();
                else this.hookRouter.applyHookWithArgs((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, accounts);
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
}


var $85bc198bca370cae$exports = {};

class $85bc198bca370cae$var$Ethereum {
    constructor(data){
        this.metaMask = new (0, $05db05568a951b86$export$2c78a3b4fc11d8fa)(data?.metaMask);
    }
}


$parcel$exportWildcard($61dc865ce14f4bf4$exports, $05db05568a951b86$exports);
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $85bc198bca370cae$exports);


var $dc4d60a7eb431eef$exports = {};
var $0e4707f80e4e0187$exports = {};

$parcel$export($0e4707f80e4e0187$exports, "MyAlgo", () => $0e4707f80e4e0187$export$6ab354d5c56bf95);




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
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$0e4707f80e4e0187$var$initialState
        };
    }
    enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $28ac839a9eca26f5$export$313d299817c74896)();
    }
    async init() {
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
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
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $90bab4f8b8f7e96d$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        this.hookRouter.applyHooks([
            (0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
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
        return this.state.accounts[0];
    }
    getAccounts() {
        return this.state.accounts;
    }
    async fetchCurrentChainID() {
        return "0x1";
    }
    onAccountChange(cb) {
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, ()=>{
            return cb(this.getPrimaryAccount());
        });
    }
    onChainChange(cb) {
        return this.hookRouter.registerCallback((0, $90bab4f8b8f7e96d$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async ()=>{
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    }
    onBlockAdded(cb) {
        throw new (0, $28ac839a9eca26f5$export$e162153238934121)();
    }
    toJSON() {
        return this.state;
    }
    getProvider() {
        if (this.provider instanceof (0, $hgUW1$randlabsmyalgoconnect)) return this.provider;
        this.provider = new (0, $hgUW1$randlabsmyalgoconnect)();
        return this.provider;
    }
}


var $b5af4601982a5fe5$exports = {};

$parcel$export($b5af4601982a5fe5$exports, "Algorand", () => $b5af4601982a5fe5$export$2a2454b5976b73ac);

class $b5af4601982a5fe5$export$2a2454b5976b73ac {
    constructor(data){
        this.myAlgo = new (0, $0e4707f80e4e0187$export$6ab354d5c56bf95)(data?.myAlgo);
    }
}


$parcel$exportWildcard($dc4d60a7eb431eef$exports, $0e4707f80e4e0187$exports);
$parcel$exportWildcard($dc4d60a7eb431eef$exports, $b5af4601982a5fe5$exports);





export {$81c1b644006d48ec$export$412a02074a4127ac as WALLETS, $05db05568a951b86$export$2c78a3b4fc11d8fa as Metamask, $0e4707f80e4e0187$export$6ab354d5c56bf95 as MyAlgo, $b5af4601982a5fe5$export$2a2454b5976b73ac as Algorand, $412a545945027ba9$export$24b8fbafc4b6a151 as useWindow, $28ac839a9eca26f5$export$e162153238934121 as NotImplementedError, $28ac839a9eca26f5$export$72563c16b91dfd16 as WalletNotInstalledError, $28ac839a9eca26f5$export$313d299817c74896 as WalletNotConnectedError, $28ac839a9eca26f5$export$f4d277c155d1965e as HookNotAvailableError};
//# sourceMappingURL=module.js.map
