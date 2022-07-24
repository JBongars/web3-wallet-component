const useWindow = <T>(cb: (windowObject: unknown) => T): T | null => {
  if (Object.keys(globalThis).includes("window")) {
    return cb(globalThis.window);
  } else {
    return null;
  }
};

export { useWindow };
