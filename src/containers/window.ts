const useWindow = async (cb: (windows: Window) => Promise<unknown>) => {
  try {
    // @ts-expect-error
    if (process.browser) {
      return await cb(window);
    }
  } catch (err) {
    console.log("Error opening window...");
    console.log(err);
  }

  return null;
};

export default useWindow;
