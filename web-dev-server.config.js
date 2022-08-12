import { hmrPlugin, presets } from "@open-wc/dev-server-hmr";

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  /**
   * Whether to open the browser and/or the browser path to open on
   */
  open: true,

  /**
   * Disable watch mode when hmr is enabled, as this always forces a page to reload on change
   */
  watch: false,

  /**
   * The `--node-resolve` flag uses @rollup/plugin-node-resolve to resolve module imports.
   * See all options here: https://github.com/rollup/plugins/tree/master/packages/node-resolve#options
   */
  nodeResolve: {
    /**
     * See conditional exports: https://nodejs.org/api/packages.html#conditional-exports
     */
    exportConditions: ["browser", "development"],
  },

  /**
   * Set appIndex to enable SPA routing
   */
  // appIndex: 'index.html',

  plugins: [
    /**
     * Use Hot Module Replacement. Requires @open-wc/dev-server-hmr plugin
     */
    hmrPlugin({
      /**
       * Include JS files in out folder emitted by tsc, since it's designed to work with JS files.
       */
      include: ["out/**/*.js"],
      /**
       * Presets help by configuring the detection of base classes, decorators, and/or runtime code patches.
       */
      presets: [presets.lit],
    }),
  ],
});
