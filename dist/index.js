var $8zHUo$ethers = require("ethers");
var $8zHUo$randlabsmyalgoconnect = require("@randlabs/myalgo-connect");

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

$parcel$export($faefaad95e5fcca0$exports, "WALLETS", () => $faefaad95e5fcca0$export$412a02074a4127ac);
const $faefaad95e5fcca0$export$412a02074a4127ac = {
    MYALGO: "MYALGO",
    METAMASK: "METAMASK"
};


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
var $2b09ea9ee8d63ad1$exports = {};

$parcel$export($2b09ea9ee8d63ad1$exports, "Metamask", () => $2b09ea9ee8d63ad1$export$2c78a3b4fc11d8fa);

var $fc578d3576b0d8ef$exports = {};
var $ff033dcd1750fc9d$exports = {};

$parcel$export($ff033dcd1750fc9d$exports, "useWindow", () => $ff033dcd1750fc9d$export$24b8fbafc4b6a151);
const $ff033dcd1750fc9d$export$24b8fbafc4b6a151 = (cb)=>{
    if (Object.keys(globalThis).includes("window")) return cb(globalThis.window);
    else return null;
};


$parcel$exportWildcard($fc578d3576b0d8ef$exports, $ff033dcd1750fc9d$exports);




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
    WALLET_HOOK1[WALLET_HOOK1["ACCOUNT_ON_CHANGE"] = 0] = "ACCOUNT_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["CHAIN_ON_CHANGE"] = 1] = "CHAIN_ON_CHANGE";
    WALLET_HOOK1[WALLET_HOOK1["DISCONNECT"] = 2] = "DISCONNECT";
    WALLET_HOOK1[WALLET_HOOK1["NEW_BLOCK"] = 3] = "NEW_BLOCK";
})($57b8a5d2d8300786$export$5ee9bf08a91850b9 || ($57b8a5d2d8300786$export$5ee9bf08a91850b9 = {}));


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
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).DISCONNECT,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).NEW_BLOCK, 
    ]);
    chain = null;
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$2b09ea9ee8d63ad1$var$initialState
        };
    }
    async _getProvider() {
        const ethereum = await (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)(async (windowObject)=>windowObject.ethereum);
        if (ethereum === null) throw new (0, $d083fd37dae77b99$export$72563c16b91dfd16)();
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
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this._enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
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
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    getIsConnected() {
        return this.state.isConnected;
    }
    getIsWalletInstalled() {
        const ethereum = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)(async (windowObject)=>windowObject.ethereum);
        return ethereum !== null;
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
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, (account)=>{
            return cb(account);
        });
    }
    onChainChange(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, async (currentChainId)=>{
            return cb(currentChainId);
        });
    }
    onDisconnect(cb) {
        return this.hookRouter.registerCallback((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, cb);
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
        const ethereum = (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)((window)=>window.ethereum);
        ethereum.on("accountsChanged", async (accounts)=>{
            console.log("account has changed...");
            this.state.accounts = accounts;
            this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE, accounts[0]);
        });
        ethereum.on("chainChanged", async (chainId)=>{
            this.hookRouter.applyHookWithArgs((0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE, chainId);
        });
        ethereum.on("disconnect", async (err)=>{
            this.hookRouter.applyHooks([
                (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).DISCONNECT
            ]);
            this.signOut();
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


var $d5d3dec9ab4b7763$exports = {};

class $d5d3dec9ab4b7763$var$Ethereum {
    constructor(data){
        this.metaMask = new (0, $2b09ea9ee8d63ad1$export$2c78a3b4fc11d8fa)(data?.metaMask);
    }
}


$parcel$exportWildcard($be737fe08c02d508$exports, $2b09ea9ee8d63ad1$exports);
$parcel$exportWildcard($be737fe08c02d508$exports, $d5d3dec9ab4b7763$exports);


var $b94377bbb94beb7e$exports = {};
var $a75d728b25ccd0d3$exports = {};

$parcel$export($a75d728b25ccd0d3$exports, "MyAlgo", () => $a75d728b25ccd0d3$export$6ab354d5c56bf95);




const $a75d728b25ccd0d3$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $a75d728b25ccd0d3$export$6ab354d5c56bf95 {
    hookRouter = new (0, $a71b91c4d64511bd$export$2e2bcd8739ae039)([
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).CHAIN_ON_CHANGE,
        (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).DISCONNECT, 
    ]);
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$a75d728b25ccd0d3$var$initialState
        };
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
        this.hookRouter.applyHooks([
            (0, $57b8a5d2d8300786$export$5ee9bf08a91850b9).ACCOUNT_ON_CHANGE
        ]);
        return (0, $57b8a5d2d8300786$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
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
}


var $f2b728861576b445$exports = {};

$parcel$export($f2b728861576b445$exports, "Algorand", () => $f2b728861576b445$export$2a2454b5976b73ac);

class $f2b728861576b445$export$2a2454b5976b73ac {
    constructor(data){
        this.myAlgo = new (0, $a75d728b25ccd0d3$export$6ab354d5c56bf95)(data?.myAlgo);
    }
}


$parcel$exportWildcard($b94377bbb94beb7e$exports, $a75d728b25ccd0d3$exports);
$parcel$exportWildcard($b94377bbb94beb7e$exports, $f2b728861576b445$exports);



$parcel$exportWildcard(module.exports, $faefaad95e5fcca0$exports);
$parcel$exportWildcard(module.exports, $be737fe08c02d508$exports);
$parcel$exportWildcard(module.exports, $b94377bbb94beb7e$exports);
$parcel$exportWildcard(module.exports, $fc578d3576b0d8ef$exports);
$parcel$exportWildcard(module.exports, $d083fd37dae77b99$exports);


//# sourceMappingURL=index.js.map
