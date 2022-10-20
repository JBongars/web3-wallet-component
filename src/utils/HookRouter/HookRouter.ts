import { HookNotAvailableError } from '../../errors';
import { HookEvent, HookFunction, WALLET_HOOK } from './types';

/**
 * Handles callback hooks for wallet/ chain events
 * @see WALLET_HOOK for available hooks
 * @remarks Should only be used internally as this component is prone to changing
 * @internal
 * @example
 * ```ts
 * const hookRouter = new HookRouter([WALLET_HOOK.NEW_BLOCK]); // init hook router
 * hookRouter.registerCallback(WALLET_HOOK.NEW_BLOCK, () => console.log("hello hook!")); // create a new hook
 * hookRouter.applyHooks([WALLET_HOOK.NEW_BLOCK]); // >> hello hook!
 * ```
 */
class HookRouter {
    private availableHooks: WALLET_HOOK[];
    private hooks: Map<WALLET_HOOK, Map<symbol, HookFunction>>;

    /**
     * Initializes the hook router to start listening for hooks
     * @param hooks - List of hooks the HookRouter should listen for
     */
    constructor(hooks: WALLET_HOOK[]) {
        this.hooks = new Map();
        this.availableHooks = hooks;

        this.resetAllHooks();
    }

    /**
     * Check if hook router is listening to a hook
     * @param hook - hook enum
     */
    private checkIfValidHook(hook: WALLET_HOOK) {
        if (!this.hooks.has(hook)) {
            throw new HookNotAvailableError();
        }
    }

    /**
     * self descriptive
     * @returns list of available hooks
     */
    public getAvailableHooks() {
        return [...this.availableHooks];
    }

    /**
     * clear all hooks registered to an event
     * @param hook - hook enum
     */
    public resetHook(hook: WALLET_HOOK) {
        this.checkIfValidHook(hook);

        this.hooks.delete(hook);
        this.hooks.set(hook, new Map());
    }

    /**
     * clears all available hooks resetting the hook router
     */
    public resetAllHooks() {
        this.availableHooks.forEach((hook) => {
            this.hooks.set(hook, new Map());
        });
    }

    /**
     * Register a new hook that will be called when the hook event is triggered
     * @param hook - hook enum
     * @param cb - callback to invoke when the hook is called
     * @returns a hook event
     * @see HookEvent
     * @see applyHooks
     * @remarks if a hook is expecting to be called with an argument, use @see applyHookWithArgs
     */
    public registerCallback(hook: WALLET_HOOK, cb: HookFunction): HookEvent {
        this.checkIfValidHook(hook);

        const id = Symbol();
        this.hooks.get(hook)?.set(id, cb);

        return {
            id,
            destroy: () => this.deregisterCallback(hook, id)
        };
    }

    /**
     * Deregisters a particular hook
     * @param hook - hook enum
     * @param id - hook id found in the @see HookEvent
     * @remarks hooks can also be deregistered using the @see HookEvent.destroy method
     */
    public deregisterCallback(hook: WALLET_HOOK, id: symbol) {
        this.checkIfValidHook(hook);

        this.hooks.get(hook)?.delete(id);
    }

    /**
     * Calls all hooks that are specified
     * @param hooks - list of hook enums
     * @remarks Use @see applyHookWithArgs if hooks should be called with args
     */
    public async applyHooks(hooks: WALLET_HOOK[]): Promise<void> {
        const callbacksToInvoke: HookFunction[] = [];

        hooks.forEach((hook) => {
            this.hooks.get(hook)?.forEach((fn: HookFunction) => callbacksToInvoke.push(fn));
        });

        await Promise.all(callbacksToInvoke.map((fn) => fn()));
    }

    /**
     * Calls a hook with a list of arguments
     * @param hook - hook enum
     * @param args - argument to pass to the hook callback
     * @remarks args are destructured
     */
    public async applyHookWithArgs(hook: WALLET_HOOK, ...args: unknown[]): Promise<void> {
        const callbacksToInvoke: HookFunction[] = [];

        this.hooks.get(hook)?.forEach((fn: HookFunction) => callbacksToInvoke.push(fn));

        await Promise.all(callbacksToInvoke.map((fn) => fn(...args)));
    }
}

export { HookRouter };
export default HookRouter;
