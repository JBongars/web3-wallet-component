import { HookNotAvailableError } from "../errors";
import { WALLET_HOOK } from "../types";

class HookRouter {
  private availableHooks: WALLET_HOOK[];
  private hooks: Map<WALLET_HOOK, Map<Symbol, Function>>;

  constructor(hooks: WALLET_HOOK[]) {
    this.hooks = new Map();
    this.availableHooks = hooks;

    this.resetAllHooks();
  }

  private checkIfValidHook(hook: WALLET_HOOK) {
    if (!this.hooks.has(hook)) {
      throw new HookNotAvailableError();
    }
  }

  public getAvailableHooks() {
    return [...this.availableHooks];
  }

  public resetHook(hook: WALLET_HOOK) {
    this.checkIfValidHook(hook);

    this.hooks.delete(hook);
    this.hooks.set(hook, new Map());
  }

  public resetAllHooks() {
    this.availableHooks.forEach((hook) => {
      this.hooks.set(hook, new Map());
    });
  }

  public registerCallback(hook: WALLET_HOOK, cb: Function) {
    this.checkIfValidHook(hook);

    const id = Symbol();
    this.hooks.get(hook)?.set(id, cb);

    return id;
  }

  public deregisterCallback(hook: WALLET_HOOK, id: Symbol) {
    this.checkIfValidHook(hook);

    this.hooks.get(hook)?.delete(id);
  }

  public async applyHooks(hooks: WALLET_HOOK[]): Promise<void> {
    const callbacksToInvoke: Function[] = [];

    hooks.forEach((hook) => {
      this.hooks
        .get(hook)
        ?.forEach((fn: Function) => callbacksToInvoke.push(fn));
    });

    await Promise.all(callbacksToInvoke.map((fn) => fn()));
  }

  public async applyHookWithArgs(
    hook: WALLET_HOOK,
    ...args: any[]
  ): Promise<void> {
    const callbacksToInvoke: Function[] = [];

    this.hooks.get(hook)?.forEach((fn: Function) => callbacksToInvoke.push(fn));

    await Promise.all(callbacksToInvoke.map((fn) => fn(...args)));
  }
}

export default HookRouter;
