import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { WalletHookHandlerInterface, WalletInterface } from '../../../types';
import { WALLET_STATUS } from '../../../utils/HookRouter/types';
import { MetamaskState } from '../../metamask';
import { EthereumObject, ProviderService } from '../../services';
import { EthereumBaseWallet } from '../EthereumBaseWallet';
import { BaseEthereumState } from '../types';

class EthereumBaseWalletEx extends EthereumBaseWallet {}

class MockEthereumWallet
    extends EthereumBaseWallet
    implements WalletInterface<MetamaskState>, WalletHookHandlerInterface
{
    // public chain: string | null = null;
    public ethereumWindowMock: EthereumObject = {} as unknown as EthereumObject;
    public providerMock: Web3Provider = {} as unknown as Web3Provider;

    constructor() {
        super();
    }

    public _setEthereumProvider(mock: EthereumObject): void {
        this.ethereumWindowMock = mock;
    }

    public _getEthereumProvider(): EthereumObject {
        return this.ethereumWindowMock;
    }

    public _setProvider(mock: Web3Provider): void {
        this.providerMock = mock;
    }

    public _getProvider(_ethereum?: ExternalProvider): Web3Provider {
        return this.providerMock;
    }

    public _setState(state: BaseEthereumState): void {
        this._state = state;
    }

    public _getState(): BaseEthereumState {
        return this._state;
    }

    public _setChain(chain: string): void {
        this.chain = chain;
    }

    public _getChain(): string | null {
        return this.chain;
    }

    public async init(): Promise<WALLET_STATUS> {
        return WALLET_STATUS.OK;
    }

    public async signIn(): Promise<WALLET_STATUS> {
        return WALLET_STATUS.OK;
    }

    public async signOut(): Promise<WALLET_STATUS> {
        return WALLET_STATUS.OK;
    }

    public getIsWalletInstalled(): boolean {
        return true;
    }

    // TESTS
}

describe('# MockWallet', () => {
    test('should init', () => {
        const wallet = new MockEthereumWallet();
        expect(wallet).toBeTruthy();
    });
});

export { EthereumBaseWalletEx, MockEthereumWallet };
