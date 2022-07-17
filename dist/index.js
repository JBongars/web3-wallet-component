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
$parcel$export($faefaad95e5fcca0$exports, "NotImplementedError", () => $faefaad95e5fcca0$export$e162153238934121);
$parcel$export($faefaad95e5fcca0$exports, "WalletNotInstalled", () => $faefaad95e5fcca0$export$2fb08190b68e27a3);
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
class $faefaad95e5fcca0$export$e162153238934121 extends Error {
}
class $faefaad95e5fcca0$export$2fb08190b68e27a3 extends Error {
}



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
        console.log("about to init!");
        return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        console.log("about to sign in!");
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
    async getBalance() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    toJSON() {
        return this.state;
    }
    async getSigner() {
        return async (transactions)=>{
            const myAlgoConnect = this.getProvider();
            const signedTx = await myAlgoConnect.signTransaction(transactions);
            return {
                signedTransaction: signedTx,
                status: (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK
            };
        };
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

$parcel$export($2b09ea9ee8d63ad1$exports, "MetaMask", () => $2b09ea9ee8d63ad1$export$65c0af9a97525a4b);


var $fc578d3576b0d8ef$exports = {};
var $ff033dcd1750fc9d$exports = {};

$parcel$export($ff033dcd1750fc9d$exports, "useWindow", () => $ff033dcd1750fc9d$export$24b8fbafc4b6a151);
const $ff033dcd1750fc9d$export$24b8fbafc4b6a151 = async (cb)=>{
    try {
        return await cb(window);
    } catch (err) {
        console.log("Error opening window...");
        console.log(err);
    }
    return null;
};


$parcel$exportWildcard($fc578d3576b0d8ef$exports, $ff033dcd1750fc9d$exports);


const $2b09ea9ee8d63ad1$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $2b09ea9ee8d63ad1$export$65c0af9a97525a4b {
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$2b09ea9ee8d63ad1$var$initialState
        };
    }
    async init() {
        this.provider = await this.getProvider();
        await this.mountEventListeners();
        return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this.getProvider();
        this.state.accounts = await provider.send("eth_requestAccounts", []);
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
            const provider = this.provider || await this.getProvider();
            const transactionResponse = await provider.getSigner().sendTransaction(transactions);
            return {
                signedTransaction: [
                    transactionResponse
                ],
                status: (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).OK
            };
        };
    }
    async getBalance() {
        if (!this.state.isConnected) return (0, $faefaad95e5fcca0$export$de76a1f31766a0a2).ACCOUNT_NOT_FOUND;
        const provider = this.provider || await this.getProvider();
        const balance = await provider.getBalance(this.state.accounts[0]);
        return balance.toString();
    }
    async getAssets() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    toJSON() {
        return this.state;
    }
    async mountEventListeners(callback) {
        const provider = this.provider || await this.getProvider();
        provider.on("accountsChanged", async (accounts)=>{
            this.state.accounts = accounts;
            if (callback) return callback(accounts);
        });
    }
    async unmountEventListeners(callback) {
        const provider = this.provider || await this.getProvider();
        provider.removeListener("accountsChanged", async ()=>{
            if (callback) return callback();
        });
    }
    async getProvider() {
        const ethereum = await (0, $ff033dcd1750fc9d$export$24b8fbafc4b6a151)(async (w)=>w.ethereum);
        if (!ethereum) throw new (0, $faefaad95e5fcca0$export$2fb08190b68e27a3)();
        return new (0, $8zHUo$ethers.ethers).providers.Web3Provider(ethereum);
    }
}


var $d5d3dec9ab4b7763$exports = {};

$parcel$export($d5d3dec9ab4b7763$exports, "Ethereum", () => $d5d3dec9ab4b7763$export$aa318bacd7f710c5);

class $d5d3dec9ab4b7763$export$aa318bacd7f710c5 {
    constructor(data){
        this.metaMask = new (0, $2b09ea9ee8d63ad1$export$65c0af9a97525a4b)(data?.metaMask);
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
                    target = new (0, $2b09ea9ee8d63ad1$export$65c0af9a97525a4b)(previousState);
                    break;
                case (0, $faefaad95e5fcca0$export$412a02074a4127ac).MYALGO:
                    target = new (0, $a75d728b25ccd0d3$export$6ab354d5c56bf95)(previousState);
                    break;
                default:
                    throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
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


//# sourceMappingURL=index.js.map
