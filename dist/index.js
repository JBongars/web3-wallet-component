var $8zHUo$randlabsmyalgoconnect = require("@randlabs/myalgo-connect");
var $8zHUo$ethers = require("ethers");

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
var $655db29a5e4f8c98$exports = {};

$parcel$export($655db29a5e4f8c98$exports, "WalletStore", () => $655db29a5e4f8c98$export$b2ed8906266612d9);
var $b94377bbb94beb7e$exports = {};
var $a75d728b25ccd0d3$exports = {};

$parcel$export($a75d728b25ccd0d3$exports, "MyAlgo", () => $a75d728b25ccd0d3$export$6ab354d5c56bf95);
var $faefaad95e5fcca0$exports = {};

$parcel$export($faefaad95e5fcca0$exports, "WALLET_STATUS", () => $faefaad95e5fcca0$export$de76a1f31766a0a2);
$parcel$export($faefaad95e5fcca0$exports, "WALLETS", () => $faefaad95e5fcca0$export$412a02074a4127ac);
let $faefaad95e5fcca0$export$de76a1f31766a0a2;
(function(WALLET_STATUS1) {
    WALLET_STATUS1[WALLET_STATUS1["OK"] = 0] = "OK";
    WALLET_STATUS1[WALLET_STATUS1["LOGIN_ERROR"] = 1] = "LOGIN_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["WALLET_ERROR"] = 2] = "WALLET_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["EXTENSION_NOT_FOUND"] = 3] = "EXTENSION_NOT_FOUND";
    WALLET_STATUS1[WALLET_STATUS1["ACCOUNT_NOT_FOUND"] = 4] = "ACCOUNT_NOT_FOUND";
})($faefaad95e5fcca0$export$de76a1f31766a0a2 || ($faefaad95e5fcca0$export$de76a1f31766a0a2 = {}));
const $faefaad95e5fcca0$export$412a02074a4127ac = {
    MYALGO: "MYALGO",
    METAMASK: "METAMASK"
};



var $d083fd37dae77b99$exports = {};

$parcel$export($d083fd37dae77b99$exports, "NotImplementedError", () => $d083fd37dae77b99$export$e162153238934121);
$parcel$export($d083fd37dae77b99$exports, "WalletNotInstalledError", () => $d083fd37dae77b99$export$72563c16b91dfd16);
$parcel$export($d083fd37dae77b99$exports, "WalletNotConnectedError", () => $d083fd37dae77b99$export$313d299817c74896);
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


const $859a8ceca3662d63$export$8d781dbcfe5be41e = {
    CHAIN_ID_ALGORAND: 8,
    CHAIN_ID_ETHEREUM: 2
};


const $a75d728b25ccd0d3$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $a75d728b25ccd0d3$export$6ab354d5c56bf95 {
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$a75d728b25ccd0d3$var$initialState
        };
    }
    async init() {
        return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const myAlgoConnect = this.getProvider();
        this.state.accounts = await myAlgoConnect.connect();
        this.state.isConnected = this.state.accounts.length > 0;
        return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.state.accounts = [];
        this.state.isConnected = false;
        return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
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
    getIsConnected() {
        return this.state.isConnected;
    }
    getPrimaryAccount() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    getAccounts() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    async fetchCurrentChainID() {
        return (0, $859a8ceca3662d63$export$8d781dbcfe5be41e).CHAIN_ID_ALGORAND;
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



var $be737fe08c02d508$exports = {};
var $2b09ea9ee8d63ad1$exports = {};

$parcel$export($2b09ea9ee8d63ad1$exports, "Metamask", () => $2b09ea9ee8d63ad1$export$2c78a3b4fc11d8fa);


var $fc578d3576b0d8ef$exports = {};
var $ff033dcd1750fc9d$exports = {};

$parcel$export($ff033dcd1750fc9d$exports, "useWindow", () => $ff033dcd1750fc9d$export$24b8fbafc4b6a151);
const $ff033dcd1750fc9d$export$24b8fbafc4b6a151 = async (cb)=>{
    try {
        await cb(window);
    } catch (err) {
        console.log("Error opening window...");
        console.log(err);
    }
};


$parcel$exportWildcard($fc578d3576b0d8ef$exports, $ff033dcd1750fc9d$exports);



const $2b09ea9ee8d63ad1$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $2b09ea9ee8d63ad1$export$2c78a3b4fc11d8fa {
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$2b09ea9ee8d63ad1$var$initialState
        };
    }
    enforceIsConnected() {
        if (!this.getIsConnected()) throw new (0, $d083fd37dae77b99$export$313d299817c74896)();
    }
    async init() {
        this.provider = await this.getProvider();
        return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this.getProvider();
        this.state.accounts = await provider.send("eth_requestAccounts", []);
        this.state.isConnected = this.state.accounts.length > 0;
        return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.enforceIsConnected();
        this.state.accounts = [];
        this.state.isConnected = false;
        return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            this.enforceIsConnected();
            const provider = this.provider || await this.getProvider();
            const transactionResponse = await provider.getSigner().sendTransaction(transactions[0]);
            return [
                transactionResponse
            ];
        };
    }
    async getBalance() {
        this.enforceIsConnected();
        const provider = this.provider || await this.getProvider();
        const balance = await provider.getBalance(this.state.accounts[0]);
        return balance.toString();
    }
    async getAssets() {
        throw new (0, $d083fd37dae77b99$export$e162153238934121)();
    }
    getIsConnected() {
        return this.state.isConnected;
    }
    getPrimaryAccount() {
        this.enforceIsConnected();
        return this.state.accounts[0];
    }
    getAccounts() {
        this.enforceIsConnected();
        return this.state.accounts;
    }
    async fetchCurrentChainID() {
        this.enforceIsConnected();
        const provider = await this.getProvider();
        const chainId = await provider.send("eth_chainId", []);
        return chainId;
    }
    toJSON() {
        return this.state;
    }
    async mountEventListeners(callback) {
        const provider = await this.getProvider();
        provider.on("accountsChanged", async (accounts)=>{
            this.state.accounts = accounts;
            if (callback) return callback(accounts);
        });
    }
    async unmountEventListeners(callback) {
        const provider = await this.getProvider();
        provider.removeListener("accountsChanged", async ()=>{
            if (callback) return callback();
        });
    }
    async getProvider() {
        const ethereum = await (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)(async (windowObject)=>windowObject.ethereum);
        if (!ethereum) throw new (0, $d083fd37dae77b99$export$72563c16b91dfd16)();
        return new (0, $8zHUo$ethers.ethers).providers.Web3Provider(ethereum);
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



const $9ba0f9a5c47c04f2$export$9cd59f9826255e47 = (obj)=>JSON.parse(JSON.stringify(obj));
const $9ba0f9a5c47c04f2$export$22d904b3af0cacbd = (obj)=>obj && obj !== null ? $9ba0f9a5c47c04f2$export$9cd59f9826255e47(obj) : null;
const $9ba0f9a5c47c04f2$export$4c7dc056506f1572 = (callback)=>new Proxy({}, {
        get (_target, prop, receiver) {
            const result = callback(prop);
            if (result === null) return receiver;
            else return result;
        }
    });


class $655db29a5e4f8c98$export$b2ed8906266612d9 {
    constructor(config){
        this.walletStates = config.previousWalletState || [];
    }
    updateState(key, newState) {
        const wallet = this.walletStates.find((elem)=>elem.id === key);
        if (!wallet || wallet === null) {
            const newWalletState = {
                id: key,
                state: newState,
                previousStates: []
            };
            this.walletStates.push(newWalletState);
            return newWalletState;
        }
        wallet.previousStates.push(wallet.state);
        wallet.state = newState;
        return wallet;
    }
    use(walletName) {
        return (0, $9ba0f9a5c47c04f2$export$4c7dc056506f1572)((prop)=>{
            if (prop === "state") return (0, $9ba0f9a5c47c04f2$export$22d904b3af0cacbd)(this.walletStates.find((elem)=>elem.id === walletName)?.state);
            // there may be an issue where if the client preserves multiple
            // proxies, the wallet state could fall out of sync...
            let target;
            const previousState = this.walletStates.find((elem)=>elem.id === walletName)?.state;
            switch(walletName){
                case (0, $faefaad95e5fcca0$export$412a02074a4127ac).METAMASK:
                    target = new (0, $2b09ea9ee8d63ad1$export$2c78a3b4fc11d8fa)(previousState);
                    break;
                case (0, $faefaad95e5fcca0$export$412a02074a4127ac).MYALGO:
                    target = new (0, $a75d728b25ccd0d3$export$6ab354d5c56bf95)(previousState);
                    break;
                default:
                    throw new (0, $d083fd37dae77b99$export$e162153238934121)();
            }
            if (typeof target[prop] !== "function") return target[prop];
            return async (...args)=>{
                const result = await target[prop](...args);
                this.updateState(walletName, target.toJSON());
                return result;
            };
        });
    }
    toJSON() {
        return this.walletStates.map((elem)=>(0, $9ba0f9a5c47c04f2$export$9cd59f9826255e47)(elem));
    }
}







$parcel$exportWildcard(module.exports, $655db29a5e4f8c98$exports);
$parcel$exportWildcard(module.exports, $faefaad95e5fcca0$exports);
$parcel$exportWildcard(module.exports, $be737fe08c02d508$exports);
$parcel$exportWildcard(module.exports, $b94377bbb94beb7e$exports);
$parcel$exportWildcard(module.exports, $fc578d3576b0d8ef$exports);
$parcel$exportWildcard(module.exports, $d083fd37dae77b99$exports);


//# sourceMappingURL=index.js.map
