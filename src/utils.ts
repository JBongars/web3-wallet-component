/**
 * Clones an object creating a separate reference pointer
 * @param obj - Object generic in Javascript
 * @returns A clone of the object that was passed
 */
const clone = (obj: { [key: string]: unknown }): { [key: string]: unknown } => JSON.parse(JSON.stringify(obj));

/**
 * Clones an iffy object (object that may be null)
 * @param obj - Object generic in Javascript
 * @returns A clone of the object if the object is not null. Otherwise returns null
 */
const iffyClone = (obj: { [key: string]: unknown } | null | undefined): { [key: string]: unknown } | null | undefined =>
    obj && obj !== null ? clone(obj) : null;

/**
 * Wrap object inside a proxy and use a callback to intercept all calls
 * @param callback - Function that should be called before property gets returned
 * @returns Object property that was intended to be returned
 */
const useProxy = (callback: (prop: string | symbol) => Promise<unknown> | unknown): any =>
    new Proxy(
        {},
        {
            get(_target, prop, receiver) {
                const result = callback(prop);
                if (result === null) return receiver;
                else return result;
            }
        }
    );

export { clone, iffyClone, useProxy };
