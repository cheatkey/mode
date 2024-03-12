const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  coverageProvider: "v8",
  testEnvironment: "@quramy/jest-prisma/environment",
  setupFilesAfterEnv: ["<rootDir>/setup-prisma.js"],
  preset: "ts-jest",
  moduleNameMapper: {
    "lodash-es": "lodash",
  },
};

module.exports = createJestConfig(config);
