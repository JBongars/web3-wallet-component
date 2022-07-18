const useWindow = async (
  cb: (windows: unknown) => Promise<void>
): Promise<void> => {
  try {
    await cb(window as unknown);
  } catch (err) {
    console.log("Error opening window...");
    console.log(err);
  }
};

export { useWindow };
