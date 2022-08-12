import nodeResolve from "@rollup/plugin-node-resolve";
import html from "@web/rollup-plugin-html";
import { importMetaAssets } from "@web/rollup-plugin-import-meta-assets";
import { terser } from "rollup-plugin-terser";
import minifyHTMLLiterals from "rollup-plugin-minify-html-literals";
import summary from "rollup-plugin-summary";

export default {
  input: "index.html",
  output: {
    entryFileNames: "[hash].js",
    assetFileNames: "[hash][extname]",
    format: "es",
    dir: "dist",
  },

  /**
   * This is the recommended setting for web apps where the entry chunks are to be placed in script tags
   * as it may reduce both the number of chunks and possibly the bundle size.
   * See https://rollupjs.org/guide/en/#preserveentrysignatures
   */
  preserveEntrySignatures: false,

  plugins: [
    /* Enable using HTML as rollup entrypoint */
    html({
      minify: true,
      strictCSPInlineScripts: true,
    }),
    /* Resolve bare module imports */
    nodeResolve(),
    /* Minify HTML template literals */
    minifyHTMLLiterals(),
    /* Minify JS */
    terser({
      ecma: 2019,
      // Use when minifying an ES6 module
      module: true,
    }),
    // Bundle assets references via import.meta.url
    importMetaAssets(),
    // Print bundle summary
    summary(),
  ],
};
