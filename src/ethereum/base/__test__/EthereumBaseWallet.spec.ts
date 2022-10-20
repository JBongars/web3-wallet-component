import { template } from '@babel/core';
import { stringLiteral } from '@babel/types';
import { Web3Provider } from '@ethersproject/providers';
import { beforeEach, describe, expect, test } from '@jest/globals';
import HookRouter from '../../../utils/HookRouter';
import { WALLET_HOOK } from '../../../utils/HookRouter/types';
import WalletStateStorage from '../../../WalletStateStorage';
import { EthereumObject, ProviderService } from '../../services';
import { EthereumEvent } from '../../services/ethereumEvents';
import { BaseEthereumChainConfig, BaseEthereumState } from '../types';
import { MockEthereumWallet } from './MockWallet.spec';

describe('# EthereumBaseWallet', () => {
    let providerServiceMock: Record<string, jest.SpyInstance>;
    let providerMock: Web3Provider;
    let stateMock: BaseEthereumState;
    let wallet: MockEthereumWallet;

    beforeEach(() => {
        stateMock = { isConnected: true, accounts: ['test-account'] };
        providerServiceMock = {
            fetchCurrentChainID: jest.spyOn(ProviderService, 'fetchCurrentChainID').mockResolvedValue('0x1'),
            addChainToWallet: jest.spyOn(ProviderService, 'addChainToWallet'),
            switchChainFromWallet: jest.spyOn(ProviderService, 'switchChainFromWallet')
        };
        providerMock = {
            name: 'providerMock',
            send: jest.fn((method: string, params?: any[]) => Promise.resolve()),
            request: jest.fn((method: string, params?: any[]) => Promise.resolve())
        } as any;
    });

    describe('## getSigner', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account'] };
            providerServiceMock = {
                ...providerServiceMock,
                getSigner: jest.spyOn(ProviderService, 'getSigner').mockReturnValue('test-signer' as any)
            };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the signer object', async () => {
            const signerSpy = jest.spyOn(ProviderService, 'getSigner').mockReturnValue('test-signer' as any);
            const result = await wallet.getSigner();
            expect(result).toEqual('test-signer');
            expect(signerSpy).toBeCalledWith(providerMock);
        });

        test('should not get the signer object if provider service is not available', async () => {
            const signerSpy = jest.spyOn(ProviderService, 'getSigner').mockImplementation(() => {
                throw new Error('mock-error');
            });
            wallet._setState({ ...stateMock, isConnected: true });
            try {
                await wallet.getSigner();
            } catch (err: any) {
                expect(err.message).toEqual('mock-error');
                expect(signerSpy).toBeCalledWith(providerMock);
            }
            expect.assertions(2);
        });
    });

    describe('## getBalance', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account'] };
            providerServiceMock = {
                ...providerServiceMock,
                getSigner: jest.spyOn(ProviderService, 'getBalance').mockReturnValue('test-balance' as any)
            };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the balance', async () => {
            const balanceSpy = jest.spyOn(ProviderService, 'getBalance').mockReturnValue('test-balance' as any);
            const result = await wallet.getBalance();
            expect(result).toEqual('test-balance');
            expect(balanceSpy).toBeCalledWith(providerMock, 'test-account');
        });

        test('should not get the balance if wallet is not connected', async () => {
            const balanceSpy = jest.spyOn(ProviderService, 'getSigner').mockReturnValue('test-balance' as any);
            wallet._setState({ ...stateMock, isConnected: false });
            try {
                await wallet.getBalance();
            } catch (err: any) {
                expect(err.name).toEqual('WalletNotConnectedError');
                expect(balanceSpy).not.toBeCalled();
            }
            expect.assertions(2);
        });

        test('should not get the balance if provider service is not available', async () => {
            const balanceSpy = jest.spyOn(ProviderService, 'getBalance').mockImplementation(() => {
                throw new Error('mock-error');
            });
            wallet._setState({ ...stateMock, isConnected: true });
            try {
                await wallet.getBalance();
            } catch (err: any) {
                expect(err.message).toEqual('mock-error');
                expect(balanceSpy).toBeCalledWith(providerMock, 'test-account');
            }
            expect.assertions(2);
        });
    });

    describe('## getAssets', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account'] };
            providerServiceMock = {
                ...providerServiceMock,
                getAssets: jest.spyOn(ProviderService, 'getAssets').mockReturnValue('test-asset' as any)
            };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the list of assets', async () => {
            const getAssetsSpy = jest.spyOn(ProviderService, 'getAssets').mockReturnValue('test-asset' as any);
            const result = await wallet.getAssets();
            expect(result).toEqual('test-asset');
            expect(getAssetsSpy).toBeCalledWith();
        });

        test('should not get the list of assets if provider service is not available', async () => {
            const getAssetsSpy = jest.spyOn(ProviderService, 'getBalance').mockImplementation(() => {
                throw new Error('mock-error');
            });
            wallet._setState({ ...stateMock, isConnected: true });
            try {
                await wallet.getBalance();
            } catch (err: any) {
                expect(err.message).toEqual('mock-error');
                expect(getAssetsSpy).toBeCalledWith(providerMock, 'test-account');
            }
            expect.assertions(2);
        });
    });

    describe('## getIsConnected', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should return true when connected', () => {
            stateMock.isConnected = true;
            expect(wallet.getIsConnected()).toBeTruthy();
        });

        test('should return false when not connected', () => {
            stateMock.isConnected = false;
            expect(wallet.getIsConnected()).toBeFalsy();
        });
    });

    describe('## getPrimaryAccount', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the primary account', async () => {
            const result = await wallet.getPrimaryAccount();
            expect(result).toEqual('test-account-1');
        });

        test('should throw error if wallet is connected but no primary account could be found', async () => {
            stateMock.accounts = [];
            try {
                await wallet.getPrimaryAccount();
            } catch (err: any) {
                expect(err.message).toEqual('wallet is marked as connected but could not find primary account');
            }
            expect.assertions(1);
        });

        test('should get the primary account for only one account', async () => {
            stateMock.accounts = ['test-account-1'];
            const result = await wallet.getPrimaryAccount();
            expect(result).toEqual('test-account-1');
        });

        test('should not get the primary account if wallet is not connected', async () => {
            wallet._setState({ ...stateMock, isConnected: false });
            try {
                await wallet.getPrimaryAccount();
            } catch (err: any) {
                expect(err.name).toEqual('WalletNotConnectedError');
            }
            expect.assertions(1);
        });
    });

    describe('## getAccounts', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the list of account', async () => {
            const result = wallet.getAccounts();
            expect(result).toEqual(['test-account-1', 'test-account-2']);
        });

        test('should get the list of account for only one account', async () => {
            stateMock.accounts = ['test-account-1'];
            const result = wallet.getAccounts();
            expect(result).toEqual(['test-account-1']);
        });

        test('should not throw an error if wallet is connected but no accounts are connected', async () => {
            stateMock.accounts = [];
            const consoleMock = jest.spyOn(console, 'warn');
            const result = wallet.getAccounts();
            expect(result).toEqual([]);
            expect(consoleMock).toBeCalledWith('wallet is marked as connected but the state.account length is 0');
        });

        test('should not get the balance if wallet is not connected', async () => {
            wallet._setState({ ...stateMock, isConnected: false });
            try {
                wallet.getAccounts();
            } catch (err: any) {
                expect(err.name).toEqual('WalletNotConnectedError');
            }
            expect.assertions(1);
        });
    });

    describe('## fetchCurrentChainID', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should return the current chain id when called', async () => {
            providerServiceMock.fetchCurrentChainID.mockResolvedValue('0x1');
            const result = await wallet.fetchCurrentChainID();
            expect(result).toEqual('0x1');
            expect(providerServiceMock.fetchCurrentChainID).toBeCalledWith(providerMock);
        });
    });

    describe('## addChainToWallet', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should return the current chain id when called', async () => {
            const mockChainConfig: BaseEthereumChainConfig = {
                chainName: 'test-chain',
                chainId: '0x1',
                nativeCurrency: {
                    name: 'test-token',
                    decimals: 18,
                    symbol: 'TT'
                },
                rpcUrls: ['some-url']
            };
            providerServiceMock.addChainToWallet.mockImplementation(() => Promise.resolve());
            const result = await wallet.addChainToWallet(mockChainConfig);
            expect(result).toBeUndefined();
            expect(providerServiceMock.addChainToWallet).toBeCalledWith(mockChainConfig);
        });
    });

    describe('## switchChainFromWallet', () => {
        let ethereumProviderMock: EthereumObject;
        beforeEach(() => {
            ethereumProviderMock = {
                networkVersion: '0x1',
                on: jest.fn(() => {}) as EthereumEvent
            };
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            wallet._setEthereumProvider(ethereumProviderMock);
            jest.resetAllMocks();
        });

        test('should switch chains to the chain being called', async () => {
            const nextChain = '0x2';
            providerServiceMock.switchChainFromWallet.mockImplementation(() => Promise.resolve());
            const result = await wallet.switchChainFromWallet(nextChain);

            expect(result).toBeUndefined();
            expect(providerServiceMock.switchChainFromWallet).toBeCalledWith(ethereumProviderMock, nextChain);
            // expect(wallet.chain).not.toEqual(nextChain);
        });

        test('should switch chains to the chain being called and trigger chain change', async () => {
            const nextChain = '0x2';
            providerServiceMock.switchChainFromWallet.mockImplementation(() => Promise.resolve());
            const result = await wallet.switchChainFromWallet(nextChain, true);

            expect(result).toBeUndefined();
            expect(providerServiceMock.switchChainFromWallet).toBeCalledWith(ethereumProviderMock, nextChain);
            expect(wallet._getChain()).toEqual(nextChain);
        });
    });

    describe('## toJSON', () => {
        let ethereumProviderMock: EthereumObject;
        beforeEach(() => {
            ethereumProviderMock = {
                networkVersion: '0x1',
                on: jest.fn(() => {}) as EthereumEvent
            };
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            wallet._setEthereumProvider(ethereumProviderMock);
            jest.resetAllMocks();
        });

        test('should return state', () => {
            const result = wallet.toJSON();
            expect(result).toEqual(stateMock);
        });
    });

    describe('## getProvider', () => {
        let ethereumProviderMock: EthereumObject;
        beforeEach(() => {
            ethereumProviderMock = {
                networkVersion: '0x1',
                on: jest.fn(() => {}) as EthereumEvent
            };
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            wallet._setEthereumProvider(ethereumProviderMock);
            jest.resetAllMocks();
        });

        test('should return provider', async () => {
            const result = await wallet.getProvider();
            expect(result).toEqual(providerMock);
        });
    });

    describe('## Event Listeners', () => {
        let ethereumProviderMock: EthereumObject;
        let walletStorageSpy: WalletStateStorage;
        let hookRouterSpy: HookRouter;
        beforeEach(() => {
            ethereumProviderMock = {
                networkVersion: '0x1',
                on: jest.fn(() => {}) as EthereumEvent
            };
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            wallet._setEthereumProvider(ethereumProviderMock);

            hookRouterSpy = {
                registerCallback: jest.spyOn(wallet._getHookRouter(), 'registerCallback') as any,
                applyHooks: jest.spyOn(wallet._getHookRouter(), 'applyHooks') as any,
                applyHookWithArgs: jest.spyOn(wallet._getHookRouter(), 'applyHookWithArgs') as any
            } as any;

            walletStorageSpy = {
                updateValue: jest.spyOn(wallet._getStorageValue(), 'updateValue') as any
            } as any;

            jest.resetAllMocks();
        });

        test('### onAccountChange', async () => {
            wallet.onAccountChange('some-function' as any);
            expect(hookRouterSpy.registerCallback).toBeCalledWith(WALLET_HOOK.ACCOUNT_ON_CHANGE, 'some-function');
        });

        test('### onChainChange', async () => {
            wallet.onChainChange('some-function' as any);
            expect(hookRouterSpy.registerCallback).toBeCalledWith(WALLET_HOOK.CHAIN_ON_CHANGE, 'some-function');
        });

        test('### onAccountDisconnect', async () => {
            wallet.onAccountDisconnect('some-function' as any);
            expect(hookRouterSpy.registerCallback).toBeCalledWith(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, 'some-function');
        });

        test('### onChainDisconnect', async () => {
            wallet.onChainDisconnect('some-function' as any);
            expect(hookRouterSpy.registerCallback).toBeCalledWith(WALLET_HOOK.CHAIN_ON_DISCONNECT, 'some-function');
        });

        test('### onBlockAdded', async () => {
            wallet.onBlockAdded('some-function' as any);
            expect(hookRouterSpy.registerCallback).toBeCalledWith(
                WALLET_HOOK.NEW_BLOCK,
                expect.anything() // function
            );
        });

        describe('### mountEventListeners', () => {
            let providerEvents: Record<string, Function> = {};
            let ethereumEvents: Record<string, Function> = {};

            beforeEach(() => {
                providerEvents = {};
                ethereumEvents = {};
                providerMock.on = jest.fn().mockImplementation((eventName: string, cb: Function) => {
                    providerEvents[eventName] = cb;
                });
                ethereumProviderMock.on = jest.fn().mockImplementation((eventName: string, cb: Function) => {
                    ethereumEvents[eventName] = cb;
                });
            });

            test('should mount all event listeners', async () => {
                await wallet.mountEventListeners();

                expect(ethereumProviderMock.on).toBeCalledTimes(3);
                expect(ethereumProviderMock.on).toBeCalledWith('accountsChanged', expect.anything());
                expect(ethereumProviderMock.on).toBeCalledWith('chainChanged', expect.anything());
                expect(ethereumProviderMock.on).toBeCalledWith('disconnect', expect.anything());
                expect(providerMock.on).toBeCalledTimes(1);
                expect(providerMock.on).toBeCalledWith('block', expect.anything());

                expect(hookRouterSpy.applyHookWithArgs).not.toBeCalled();
                expect(hookRouterSpy.applyHooks).not.toBeCalled();
            });

            describe('#### onAccountChange', () => {
                test('should update for one account', async () => {
                    await wallet.mountEventListeners();

                    await ethereumEvents.accountsChanged(['test-account-3']);
                    expect(wallet._getState().accounts).toEqual(['test-account-3']);
                    expect(hookRouterSpy.applyHookWithArgs).toBeCalledWith(WALLET_HOOK.ACCOUNT_ON_CHANGE, [
                        'test-account-3'
                    ]);
                    expect(hookRouterSpy.applyHooks).not.toBeCalled();
                    expect(walletStorageSpy.updateValue).toBeCalledWith(true, 'test-account-3', ['test-account-3']);
                });

                test('should update for many accounts', async () => {
                    await wallet.mountEventListeners();

                    await ethereumEvents.accountsChanged(['test-account-3', 'test-account-4']);
                    expect(wallet._getState().accounts).toEqual(['test-account-3', 'test-account-4']);
                    expect(hookRouterSpy.applyHookWithArgs).toBeCalledWith(WALLET_HOOK.ACCOUNT_ON_CHANGE, [
                        'test-account-3',
                        'test-account-4'
                    ]);
                    expect(hookRouterSpy.applyHooks).not.toBeCalled();
                    expect(walletStorageSpy.updateValue).toBeCalledWith(true, 'test-account-3', [
                        'test-account-3',
                        'test-account-4'
                    ]);
                });

                test('should disconnect the wallet for no accounts available', async () => {
                    await wallet.mountEventListeners();

                    await ethereumEvents.accountsChanged([]);
                    expect(wallet._getState().accounts).toEqual([]);
                    expect(hookRouterSpy.applyHooks).toBeCalledWith([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
                    expect(hookRouterSpy.applyHookWithArgs).not.toBeCalled();
                    expect(walletStorageSpy.updateValue).toBeCalledWith(false, '', []);
                });
            });

            describe('#### chainChanged', () => {
                test('should apply hook for chain change', async () => {
                    await wallet.mountEventListeners();

                    await ethereumEvents.chainChanged('0x2');
                    expect(wallet._getState()).toEqual(stateMock);
                    expect(hookRouterSpy.applyHookWithArgs).toBeCalledWith(WALLET_HOOK.CHAIN_ON_CHANGE, '0x2');
                    expect(hookRouterSpy.applyHooks).not.toBeCalled();
                    expect(walletStorageSpy.updateValue).not.toBeCalledWith();
                });
            });

            describe('#### disconnect', () => {
                test('should apply hook for chain change', async () => {
                    await wallet.mountEventListeners();

                    await ethereumEvents.disconnect();
                    expect(wallet._getState()).toEqual(stateMock);
                    expect(hookRouterSpy.applyHooks).toBeCalledWith([WALLET_HOOK.CHAIN_ON_DISCONNECT]);
                    expect(hookRouterSpy.applyHookWithArgs).not.toBeCalled();
                    expect(walletStorageSpy.updateValue).not.toBeCalledWith();
                });
            });

            describe('#### block', () => {
                test('should apply hook for chain change', async () => {
                    await wallet.mountEventListeners();

                    await providerEvents.block(123);
                    expect(wallet._getState()).toEqual(stateMock);
                    expect(hookRouterSpy.applyHookWithArgs).toBeCalledWith(WALLET_HOOK.NEW_BLOCK, 123);
                    expect(hookRouterSpy.applyHooks).not.toBeCalled();
                    expect(walletStorageSpy.updateValue).not.toBeCalledWith();
                });
            });

            describe('### unmountEventListeners', () => {
                test('should remove event listeners by calling the provider service', async () => {
                    providerMock.removeAllListeners = jest.fn();

                    await wallet.unmountEventListeners();
                    expect(providerMock.removeAllListeners).toBeCalledTimes(1);
                });
            });
        });
    });
});
