const clone = (obj: { [key: string]: unknown }): { [key: string]: unknown } =>
  JSON.parse(JSON.stringify(obj));

const iffyClone = (
  obj: { [key: string]: unknown } | null | undefined
): { [key: string]: unknown } | null | undefined =>
  obj && obj !== null ? clone(obj) : null;

const useProxy = (
  callback: (prop: string | Symbol) => Promise<unknown> | unknown
): any =>
  new Proxy(
    {},
    {
      get(_target, prop, receiver) {
        const result = callback(prop);
        if (result === null) return receiver;
        else return result;
      },
    }
  );

export { clone, iffyClone, useProxy };
