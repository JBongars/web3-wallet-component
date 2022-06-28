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
var $655db29a5e4f8c98$exports = {};

$parcel$export($655db29a5e4f8c98$exports, "WalletStore", () => $655db29a5e4f8c98$export$b2ed8906266612d9);
var $b94377bbb94beb7e$exports = {};
var $a75d728b25ccd0d3$exports = {};

$parcel$export($a75d728b25ccd0d3$exports, "MyAlgo", () => $a75d728b25ccd0d3$export$6ab354d5c56bf95);
var $faefaad95e5fcca0$exports = {};

$parcel$export($faefaad95e5fcca0$exports, "WALLETS", () => $faefaad95e5fcca0$export$412a02074a4127ac);
$parcel$export($faefaad95e5fcca0$exports, "NotImplementedError", () => $faefaad95e5fcca0$export$e162153238934121);
let $faefaad95e5fcca0$var$WALLET_STATUS;
(function(WALLET_STATUS1) {
    WALLET_STATUS1[WALLET_STATUS1["OK"] = 0] = "OK";
    WALLET_STATUS1[WALLET_STATUS1["LOGIN_ERROR"] = 1] = "LOGIN_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["WALLET_ERROR"] = 2] = "WALLET_ERROR";
    WALLET_STATUS1[WALLET_STATUS1["EXTENSION_NOT_FOUND"] = 3] = "EXTENSION_NOT_FOUND";
})($faefaad95e5fcca0$var$WALLET_STATUS || ($faefaad95e5fcca0$var$WALLET_STATUS = {}));
const $faefaad95e5fcca0$export$412a02074a4127ac = {
    MYALGO: "MYALGO",
    METAMASK: "METAMASK"
};
class $faefaad95e5fcca0$export$e162153238934121 extends Error {
}


const $a75d728b25ccd0d3$var$initialState = Object.freeze({
    data1: "",
    data2: "",
    counter: 0
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
    test() {
        this.state.counter++;
        return "ok";
    }
    async init() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async signIn() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async signOut() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async getSigner() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async getBallance() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    toJSON() {
        return this.state;
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

const $2b09ea9ee8d63ad1$var$initialState = Object.freeze({
    data1: "",
    data2: ""
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
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async signIn() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async signOut() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async getSigner() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async getBallance() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    async getAssets() {
        throw new (0, $faefaad95e5fcca0$export$e162153238934121)();
    }
    toJSON() {
        return this.state;
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


$parcel$exportWildcard(module.exports, $655db29a5e4f8c98$exports);
$parcel$exportWildcard(module.exports, $faefaad95e5fcca0$exports);
$parcel$exportWildcard(module.exports, $be737fe08c02d508$exports);
$parcel$exportWildcard(module.exports, $b94377bbb94beb7e$exports);
$parcel$exportWildcard(module.exports, $fc578d3576b0d8ef$exports);


//# sourceMappingURL=index.js.map
