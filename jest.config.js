module.exports = {
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  testMatch: [
    "<rootDir>/src/**/*.spec.ts",
    "<rootDir>/integration/**/*.spec.ts",
  ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  // skip coverage for now.

  // collectCoverage: true,
  // collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
};
