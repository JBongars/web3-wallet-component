import { describe, expect, test, beforeEach } from '@jest/globals';
import { assert } from 'console';
import { HookNotAvailableError } from '../../../errors';
import HookRouter from '../HookRouter';
import { WALLET_HOOK } from '../types';

describe('# HookRouter', () => {
    test('should init a hookRouter without error', async () => {
        try {
            const hookRouter = new HookRouter([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(1).toEqual(1);
        } catch (err) {
            throw err;
        }
        assert(1);
    });

    describe('## getAvailableHooks', () => {
        let hookRouter: HookRouter;
        const hooks = [WALLET_HOOK.ACCOUNT_ON_CHANGE, WALLET_HOOK.ACCOUNT_ON_DISCONNECT];

        beforeEach(() => {
            hookRouter = new HookRouter(hooks);
        });

        test('should return available hooks on call', () => {
            expect(hookRouter.getAvailableHooks()).toEqual(hooks);
        });
    });

    describe('## resetHook', () => {
        let hookRouter: HookRouter;
        const hooks = [WALLET_HOOK.ACCOUNT_ON_CHANGE, WALLET_HOOK.ACCOUNT_ON_DISCONNECT];

        beforeEach(() => {
            hookRouter = new HookRouter(hooks);
        });

        test('should throw an error if called with a hook that is not available', () => {
            try {
                hookRouter.resetHook(WALLET_HOOK.CONNECT);
            } catch (err: any) {
                expect(err.name).toEqual(HookNotAvailableError.name);
            }
            assert(1);
        });

        test('should reset the hook when called', () => {
            const callbackMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackMock);
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackMock).toBeCalled();
            callbackMock.mockReset();
            hookRouter.resetHook(WALLET_HOOK.ACCOUNT_ON_CHANGE);
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackMock).not.toBeCalled();
        });

        test('should reset multiple hooks when called', () => {
            const callbackMock = jest.fn();
            const callbackMock1 = jest.fn();
            const callbackMock2 = jest.fn();
            const callbackMock3 = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackMock);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackMock1);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackMock2);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackMock3);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackMock).toBeCalled();
            expect(callbackMock1).toBeCalled();
            expect(callbackMock2).toBeCalled();
            expect(callbackMock3).toBeCalled();

            callbackMock.mockReset();
            callbackMock1.mockReset();
            callbackMock2.mockReset();
            callbackMock3.mockReset();
            hookRouter.resetHook(WALLET_HOOK.ACCOUNT_ON_CHANGE);
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);

            expect(callbackMock).not.toBeCalled();
            expect(callbackMock1).not.toBeCalled();
            expect(callbackMock2).not.toBeCalled();
            expect(callbackMock3).not.toBeCalled();
        });

        test('should not reset the hook when called with another hook', () => {
            const callbackMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackMock);
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackMock).toBeCalled();
            callbackMock.mockReset();
            hookRouter.resetHook(WALLET_HOOK.ACCOUNT_ON_DISCONNECT);
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackMock).toBeCalled();
        });
    });

    describe('## resetAllHooks', () => {
        let hookRouter: HookRouter;
        const hooks = [WALLET_HOOK.ACCOUNT_ON_CHANGE, WALLET_HOOK.ACCOUNT_ON_DISCONNECT];

        beforeEach(() => {
            hookRouter = new HookRouter(hooks);
        });

        test('should reset all mocks the hook when called', () => {
            const callbackAccountsChangedMock = jest.fn();
            const callbackAccountOnDisconnectMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
            expect(callbackAccountsChangedMock).toBeCalled();
            expect(callbackAccountOnDisconnectMock).toBeCalled();

            callbackAccountsChangedMock.mockReset();
            callbackAccountOnDisconnectMock.mockReset();
            hookRouter.resetAllHooks();
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
            expect(callbackAccountsChangedMock).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock).not.toBeCalled();
        });
    });

    describe('## registerCallback', () => {
        let hookRouter: HookRouter;
        const hooks = [WALLET_HOOK.ACCOUNT_ON_CHANGE, WALLET_HOOK.ACCOUNT_ON_DISCONNECT];

        beforeEach(() => {
            hookRouter = new HookRouter(hooks);
        });

        test('should throw an error if called with a hook that is not available', () => {
            try {
                hookRouter.registerCallback(WALLET_HOOK.CONNECT, jest.fn());
            } catch (err: any) {
                expect(err.name).toEqual(HookNotAvailableError.name);
            }
            assert(1);
        });

        test('should register a new callback and be able to call it', () => {
            const callbackAccountsChangedMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackAccountsChangedMock).toBeCalled();
        });

        test('should register a new callback and be able to call it', () => {
            const callbackAccountsChangedMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackAccountsChangedMock).toBeCalled();
        });

        test('should register multiple callbacks and be able to call it', () => {
            const callbackAccountsChangedMock = jest.fn();
            const callbackAccountsChangedMock1 = jest.fn();
            const callbackAccountsChangedMock2 = jest.fn();
            const callbackAccountsChangedMock3 = jest.fn();
            const callbackAccountsChangedMock4 = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock1);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock2);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock3);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock4);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackAccountsChangedMock).toBeCalled();
            expect(callbackAccountsChangedMock1).toBeCalled();
            expect(callbackAccountsChangedMock2).toBeCalled();
            expect(callbackAccountsChangedMock3).toBeCalled();
            expect(callbackAccountsChangedMock4).toBeCalled();
        });

        test('should be able to call callbacks that are not registered', () => {
            const callbackAccountsChangedMock = jest.fn();
            const callbackAccountsChangedMock1 = jest.fn();
            const callbackAccountsChangedMock2 = jest.fn();
            const callbackAccountsChangedMock3 = jest.fn();
            const callbackAccountsChangedMock4 = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock1);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock2);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackAccountsChangedMock).toBeCalled();
            expect(callbackAccountsChangedMock1).toBeCalled();
            expect(callbackAccountsChangedMock2).toBeCalled();
            expect(callbackAccountsChangedMock3).not.toBeCalled();
            expect(callbackAccountsChangedMock4).not.toBeCalled();
        });

        test('should return a unique symbol for every new hook', () => {
            const callbackAccountsChangedMock = jest.fn();
            const callbackAccountsChangedMock1 = jest.fn();
            const callbackAccountsChangedMock2 = jest.fn();
            const id = hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);
            const id1 = hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock1);
            const id2 = hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock2);

            expect(typeof id.id).toEqual('symbol');
            expect(typeof id1.id).toEqual('symbol');
            expect(typeof id2.id).toEqual('symbol');
        });

        test('should return a function to destroy hook for every new hook', () => {
            const callbackAccountsChangedMock = jest.fn();
            const callbackAccountsChangedMock1 = jest.fn();
            const callbackAccountsChangedMock2 = jest.fn();
            const id = hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);
            const id1 = hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock1);
            const id2 = hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock2);

            id.destroy();
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);

            expect(callbackAccountsChangedMock).not.toBeCalled();
            expect(callbackAccountsChangedMock1).toBeCalled();
            expect(callbackAccountsChangedMock2).toBeCalled();
        });
    });

    describe('## deregister', () => {
        let hookRouter: HookRouter;
        const hooks = [WALLET_HOOK.ACCOUNT_ON_CHANGE, WALLET_HOOK.ACCOUNT_ON_DISCONNECT];

        beforeEach(() => {
            hookRouter = new HookRouter(hooks);
        });

        test('should throw an error if called with a hook that is not available', () => {
            try {
                hookRouter.deregisterCallback(WALLET_HOOK.CONNECT, {} as any);
            } catch (err: any) {
                expect(err.name).toEqual(HookNotAvailableError.name);
            }
            assert(1);
        });

        test('should remove callback when it has been deregistered', () => {
            const callbackAccountsChangedMock = jest.fn();
            const callbackAccountsChangedMock1 = jest.fn();
            const hook = hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);
            const hook1 = hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock1);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackAccountsChangedMock).toBeCalled();
            callbackAccountsChangedMock.mockReset();

            hookRouter.deregisterCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, hook.id);
            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);

            expect(callbackAccountsChangedMock).not.toBeCalled();
            expect(callbackAccountsChangedMock1).toBeCalled();
        });
    });

    describe('## applyHooks', () => {
        let hookRouter: HookRouter;
        const hooks = [WALLET_HOOK.ACCOUNT_ON_CHANGE, WALLET_HOOK.ACCOUNT_ON_DISCONNECT];

        beforeEach(() => {
            hookRouter = new HookRouter(hooks);
        });

        test('should throw an error if called with a hook that is not available', () => {
            try {
                hookRouter.applyHooks([WALLET_HOOK.CONNECT]);
            } catch (err: any) {
                expect(err.name).toEqual(HookNotAvailableError.name);
            }
            assert(1);
        });

        test('should register a new callback and be able to call it', () => {
            const callbackAccountsChangedMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackAccountsChangedMock).toBeCalled();
        });

        test('should register a new callback and be able to call it', () => {
            const callbackAccountsChangedMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackAccountsChangedMock).toBeCalled();
        });

        test('should register multiple callbacks and be able to call it', () => {
            const callbackAccountsChangedMock = jest.fn();
            const callbackAccountsChangedMock1 = jest.fn();
            const callbackAccountsChangedMock2 = jest.fn();
            const callbackAccountsChangedMock3 = jest.fn();
            const callbackAccountsChangedMock4 = jest.fn();
            const callbackAccountOnDisconnectMock = jest.fn();
            const callbackAccountOnDisconnectMock1 = jest.fn();
            const callbackAccountOnDisconnectMock2 = jest.fn();
            const callbackAccountOnDisconnectMock3 = jest.fn();
            const callbackAccountOnDisconnectMock4 = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock1);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock2);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock3);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock4);

            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock1);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock2);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock3);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock4);

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
            expect(callbackAccountsChangedMock).toBeCalled();
            expect(callbackAccountsChangedMock1).toBeCalled();
            expect(callbackAccountsChangedMock2).toBeCalled();
            expect(callbackAccountsChangedMock3).toBeCalled();
            expect(callbackAccountsChangedMock4).toBeCalled();

            expect(callbackAccountOnDisconnectMock).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock1).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock2).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock3).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock4).not.toBeCalled();

            jest.resetAllMocks();

            hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE, WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);

            expect(callbackAccountsChangedMock).toBeCalled();
            expect(callbackAccountsChangedMock1).toBeCalled();
            expect(callbackAccountsChangedMock2).toBeCalled();
            expect(callbackAccountsChangedMock3).toBeCalled();
            expect(callbackAccountsChangedMock4).toBeCalled();

            expect(callbackAccountOnDisconnectMock).toBeCalled();
            expect(callbackAccountOnDisconnectMock1).toBeCalled();
            expect(callbackAccountOnDisconnectMock2).toBeCalled();
            expect(callbackAccountOnDisconnectMock3).toBeCalled();
            expect(callbackAccountOnDisconnectMock4).toBeCalled();
        });
    });

    describe('## applyHooksWithArgs', () => {
        let hookRouter: HookRouter;
        const hooks = [WALLET_HOOK.ACCOUNT_ON_CHANGE, WALLET_HOOK.ACCOUNT_ON_DISCONNECT];

        beforeEach(() => {
            hookRouter = new HookRouter(hooks);
        });

        test('should throw an error if called with a hook that is not available', () => {
            try {
                hookRouter.applyHookWithArgs(WALLET_HOOK.CONNECT, 'hello');
            } catch (err: any) {
                expect(err.name).toEqual(HookNotAvailableError.name);
            }
            assert(1);
        });

        test('should register a new callback and be able to call it with an argument', () => {
            const callbackAccountsChangedMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);

            hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, 'hello');
            expect(callbackAccountsChangedMock).toBeCalledWith('hello');
        });

        test('should register a new callback and be able to call it with multiple arguments', () => {
            const callbackAccountsChangedMock = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);

            hookRouter.applyHookWithArgs(
                WALLET_HOOK.ACCOUNT_ON_CHANGE,
                'hello',
                12,
                undefined,
                null,
                { someObj: 12 },
                []
            );
            expect(callbackAccountsChangedMock).toBeCalledWith(
                'hello',
                12,
                undefined,
                null,
                expect.objectContaining({ someObj: 12 }),
                expect.arrayContaining([])
            );
        });
        test('should register multiple callbacks and be able to call it', () => {
            const callbackAccountsChangedMock = jest.fn();
            const callbackAccountsChangedMock1 = jest.fn();
            const callbackAccountsChangedMock2 = jest.fn();
            const callbackAccountsChangedMock3 = jest.fn();
            const callbackAccountsChangedMock4 = jest.fn();
            const callbackAccountOnDisconnectMock = jest.fn();
            const callbackAccountOnDisconnectMock1 = jest.fn();
            const callbackAccountOnDisconnectMock2 = jest.fn();
            const callbackAccountOnDisconnectMock3 = jest.fn();
            const callbackAccountOnDisconnectMock4 = jest.fn();
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock1);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock2);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock3);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, callbackAccountsChangedMock4);

            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock1);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock2);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock3);
            hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, callbackAccountOnDisconnectMock4);

            hookRouter.applyHookWithArgs(
                WALLET_HOOK.ACCOUNT_ON_CHANGE,
                'hello',
                12,
                undefined,
                null,
                { someObj: 12 },
                []
            );

            expect(callbackAccountsChangedMock).toBeCalledWith(
                'hello',
                12,
                undefined,
                null,
                expect.objectContaining({ someObj: 12 }),
                expect.arrayContaining([])
            );
            expect(callbackAccountsChangedMock1).toBeCalledWith(
                'hello',
                12,
                undefined,
                null,
                expect.objectContaining({ someObj: 12 }),
                expect.arrayContaining([])
            );
            expect(callbackAccountsChangedMock2).toBeCalledWith(
                'hello',
                12,
                undefined,
                null,
                expect.objectContaining({ someObj: 12 }),
                expect.arrayContaining([])
            );
            expect(callbackAccountsChangedMock3).toBeCalledWith(
                'hello',
                12,
                undefined,
                null,
                expect.objectContaining({ someObj: 12 }),
                expect.arrayContaining([])
            );
            expect(callbackAccountsChangedMock4).toBeCalledWith(
                'hello',
                12,
                undefined,
                null,
                expect.objectContaining({ someObj: 12 }),
                expect.arrayContaining([])
            );

            expect(callbackAccountOnDisconnectMock).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock1).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock2).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock3).not.toBeCalled();
            expect(callbackAccountOnDisconnectMock4).not.toBeCalled();
        });
    });
});
