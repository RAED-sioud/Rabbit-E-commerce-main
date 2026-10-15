/**
 * Use CommonJS export for PostCSS config to avoid ES module errors with Vite.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
};