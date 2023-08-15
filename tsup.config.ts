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
    case "admin": {
      return {
        tsconfig: "./tsconfig.admin.json",
        noExternal: [...noExternal, 'react-dom', 'react', 'nanoid'],
        outDir: "admin-dist",
        platform: "browser",
      }
    }
    default: {
      throw new Error(`Unknown build: ${build}`);
    }
  }
});
