import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const build = process.env["BUILD"];
  const noExternal = ['p-queue', 'neverthrow', 'sha1'];

  switch (build) {
    case "content": {
      return {
        tsconfig: "./tsconfig.extension.json",
        noExternal: noExternal,
        outDir: "ext-dist",
      };
    }
    case "background": {
      return {
        tsconfig: "./tsconfig.background.json",
        noExternal: noExternal,
        outDir: "ext-dist",
        format: "esm"
      };
    }
    default: {
      throw new Error(`Unknown build: ${build}`);
    }
  }
});
