import { MetaMask } from "..";

describe("# Metamask Class", () => {
  it("test method should return hello world", async () => {
    const metamask = new MetaMask();

    const result = metamask.test();

    expect(result).toEqual("hello world!");
  });
});
