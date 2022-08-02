const iffyHexToNumber = function (
  hexString: string | null | undefined
): number | null {
  if (!hexString || hexString === null) {
    return null;
  }
  return hexToNumber(hexString);
};

const hexToNumber = function (hexString: string): number {
  return parseInt(hexString, 16);
};

export { hexToNumber, iffyHexToNumber };
