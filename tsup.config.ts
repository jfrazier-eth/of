import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const build = process.env["BUILD"];

  switch (build) {
    case "content": {
      return {
        tsconfig: "./tsconfig.extension.json",
        noExternal: ["p-queue"],
        outDir: "ext-dist",
      };
    }
    case "background": {
      return {
        tsconfig: "./tsconfig.background.json",
        noExternal: ["p-queue"],
        outDir: "ext-dist",
      };
    }
    default: {
      throw new Error(`Unknown build: ${build}`);
    }
  }
});
