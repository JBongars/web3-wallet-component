import $hgUW1$randlabsmyalgoconnect from "@randlabs/myalgo-connect";
import {ethers as $hgUW1$ethers} from "ethers";

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
var $9a1f3323ce7a357e$exports = {};

$parcel$export($9a1f3323ce7a357e$exports, "WalletStore", () => $9a1f3323ce7a357e$export$b2ed8906266612d9);
var $dc4d60a7eb431eef$exports = {};
var $0e4707f80e4e0187$exports = {};

$parcel$export($0e4707f80e4e0187$exports, "MyAlgo", () => $0e4707f80e4e0187$export$6ab354d5c56bf95);
var $81c1b644006d48ec$exports = {};

$parcel$export($81c1b644006d48ec$exports, "WALLET_STATUS", () => $81c1b644006d48ec$export$de76a1f31766a0a2);
$parcel$export($81c1b644006d48ec$exports, "WALLETS", () => $81c1b644006d48ec$export$412a02074a4127ac);
$parcel$export($81c1b644006d48ec$exports, "NotImplementedError", () => $81c1b644006d48ec$export$e162153238934121);
$parcel$export($81c1b644006d48ec$exports, "WalletNotInstalled", () => $81c1b644006d48ec$export$2fb08190b68e27a3);
let $81c1b644006d48ec$export$de76a1f31766a0a2;
(function(WALLET_STATUS1) {
    WALLET_STATUS1[WALLET_STATUS1["OK"] = 0] = "OK";
    WALLET_STATUS1[WALLET_STATUS1["LOGIN_ERROR"] = 1] = "LOGIN_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["WALLET_ERROR"] = 2] = "WALLET_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["EXTENSION_NOT_FOUND"] = 3] = "EXTENSION_NOT_FOUND";
    WALLET_STATUS1[WALLET_STATUS1["ACCOUNT_NOT_FOUND"] = 4] = "ACCOUNT_NOT_FOUND";
})($81c1b644006d48ec$export$de76a1f31766a0a2 || ($81c1b644006d48ec$export$de76a1f31766a0a2 = {}));
const $81c1b644006d48ec$export$412a02074a4127ac = {
    MYALGO: "MYALGO",
    METAMASK: "METAMASK"
};
class $81c1b644006d48ec$export$e162153238934121 extends Error {
}
class $81c1b644006d48ec$export$2fb08190b68e27a3 extends Error {
}



const $0e4707f80e4e0187$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $0e4707f80e4e0187$export$6ab354d5c56bf95 {
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$0e4707f80e4e0187$var$initialState
        };
    }
    async init() {
        console.log("about to init!");
        return (0, $81c1b644006d48ec$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        console.log("about to sign in!");
        const myAlgoConnect = this.getProvider();
        this.state.accounts = await myAlgoConnect.connect();
        this.state.isConnected = this.state.accounts.length > 0;
        return (0, $81c1b644006d48ec$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.state.accounts = [];
        this.state.isConnected = false;
        return (0, $81c1b644006d48ec$export$de76a1f31766a0a2).OK;
    }
    async getBalance() {
        throw new (0, $81c1b644006d48ec$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $81c1b644006d48ec$export$e162153238934121)();
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
                status: (0, $81c1b644006d48ec$export$de76a1f31766a0a2).OK
            };
        };
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


var $61dc865ce14f4bf4$exports = {};
var $05db05568a951b86$exports = {};

$parcel$export($05db05568a951b86$exports, "MetaMask", () => $05db05568a951b86$export$65c0af9a97525a4b);


var $8c78a71587639d7a$exports = {};
var $412a545945027ba9$exports = {};

$parcel$export($412a545945027ba9$exports, "useWindow", () => $412a545945027ba9$export$24b8fbafc4b6a151);
const $412a545945027ba9$export$24b8fbafc4b6a151 = async (cb)=>{
    try {
        // if (process.browser) {
        return await cb(window);
    // }
    } catch (err) {
        console.log("Error opening window...");
        console.log(err);
    }
    return null;
};


$parcel$exportWildcard($8c78a71587639d7a$exports, $412a545945027ba9$exports);


const $05db05568a951b86$var$initialState = Object.freeze({
    accounts: [],
    isConnected: false
});
class $05db05568a951b86$export$65c0af9a97525a4b {
    constructor(state){
        if (state) this.state = {
            ...state
        };
        else this.state = {
            ...$05db05568a951b86$var$initialState
        };
    }
    async init() {
        this.provider = await this.getProvider();
        await this.mountEventListeners();
        return (0, $81c1b644006d48ec$export$de76a1f31766a0a2).OK;
    }
    async signIn() {
        const provider = await this.getProvider();
        this.state.accounts = await provider.send("eth_requestAccounts", []);
        this.state.isConnected = this.state.accounts.length > 0;
        return (0, $81c1b644006d48ec$export$de76a1f31766a0a2).OK;
    }
    async signOut() {
        this.state.accounts = [];
        this.state.isConnected = false;
        return (0, $81c1b644006d48ec$export$de76a1f31766a0a2).OK;
    }
    async getSigner() {
        return async (transactions)=>{
            const provider = this.provider || await this.getProvider();
            const transactionResponse = await provider.getSigner().sendTransaction(transactions);
            return {
                signedTransaction: [
                    transactionResponse
                ],
                status: (0, $81c1b644006d48ec$export$de76a1f31766a0a2).OK
            };
        };
    }
    async getBalance() {
        if (!this.state.isConnected) return (0, $81c1b644006d48ec$export$de76a1f31766a0a2).ACCOUNT_NOT_FOUND;
        const provider = this.provider || await this.getProvider();
        const balance = await provider.getBalance(this.state.accounts[0]);
        return balance.toString();
    }
    async getAssets() {
        throw new (0, $81c1b644006d48ec$export$e162153238934121)();
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
        const ethereum = await (0, $412a545945027ba9$export$24b8fbafc4b6a151)(async (w)=>w.ethereum);
        if (!ethereum) throw new (0, $81c1b644006d48ec$export$2fb08190b68e27a3)();
        return new (0, $hgUW1$ethers).providers.Web3Provider(ethereum);
    }
}


var $85bc198bca370cae$exports = {};

$parcel$export($85bc198bca370cae$exports, "Ethereum", () => $85bc198bca370cae$export$aa318bacd7f710c5);

class $85bc198bca370cae$export$aa318bacd7f710c5 {
    constructor(data){
        this.metaMask = new (0, $05db05568a951b86$export$65c0af9a97525a4b)(data?.metaMask);
    }
}


$parcel$exportWildcard($61dc865ce14f4bf4$exports, $05db05568a951b86$exports);
$parcel$exportWildcard($61dc865ce14f4bf4$exports, $85bc198bca370cae$exports);



const $fab42eb3dee39b5b$export$9cd59f9826255e47 = (obj)=>JSON.parse(JSON.stringify(obj));
const $fab42eb3dee39b5b$export$22d904b3af0cacbd = (obj)=>obj && obj !== null ? $fab42eb3dee39b5b$export$9cd59f9826255e47(obj) : null;
const $fab42eb3dee39b5b$export$4c7dc056506f1572 = (callback)=>new Proxy({}, {
        get (_target, prop, receiver) {
            const result = callback(prop);
            if (result === null) return receiver;
            else return result;
        }
    });


class $9a1f3323ce7a357e$export$b2ed8906266612d9 {
    constructor(config){
        this.walletStates = config.previousWalletState || [];
    }
    test() {
        return "hello world~";
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
        return (0, $fab42eb3dee39b5b$export$4c7dc056506f1572)((prop)=>{
            if (prop === "state") return (0, $fab42eb3dee39b5b$export$22d904b3af0cacbd)(this.walletStates.find((elem)=>elem.id === walletName)?.state);
            let target;
            switch(walletName){
                case (0, $81c1b644006d48ec$export$412a02074a4127ac).METAMASK:
                    target = new (0, $05db05568a951b86$export$65c0af9a97525a4b)();
                    break;
                case (0, $81c1b644006d48ec$export$412a02074a4127ac).MYALGO:
                    target = new (0, $0e4707f80e4e0187$export$6ab354d5c56bf95)();
                    break;
                default:
                    throw new (0, $81c1b644006d48ec$export$e162153238934121)();
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
        return this.walletStates.map((elem)=>(0, $fab42eb3dee39b5b$export$9cd59f9826255e47)(elem));
    }
}








export {$9a1f3323ce7a357e$export$b2ed8906266612d9 as WalletStore, $81c1b644006d48ec$export$de76a1f31766a0a2 as WALLET_STATUS, $81c1b644006d48ec$export$412a02074a4127ac as WALLETS, $81c1b644006d48ec$export$e162153238934121 as NotImplementedError, $81c1b644006d48ec$export$2fb08190b68e27a3 as WalletNotInstalled, $05db05568a951b86$export$65c0af9a97525a4b as MetaMask, $85bc198bca370cae$export$aa318bacd7f710c5 as Ethereum, $0e4707f80e4e0187$export$6ab354d5c56bf95 as MyAlgo, $b5af4601982a5fe5$export$2a2454b5976b73ac as Algorand, $412a545945027ba9$export$24b8fbafc4b6a151 as useWindow};
//# sourceMappingURL=module.js.map
