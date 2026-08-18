export default {
  testEnvironment: "node",
  watchman: false,
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["<rootDir>/tests/**/*.jest.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
