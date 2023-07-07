import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  moduleDirectories: ["node_modules", "src"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    useESM: true,
  }),
  setupFiles: ["dotenv/config"],
};
