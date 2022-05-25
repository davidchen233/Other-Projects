const path = require("path");

// webpack configuration
module.exports = {
  mode: "development",
  // entry point (where project starts <app.ts>)
  entry: "./src/app.ts",
  output: {
    // content hash for caching in browser
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
  },
  // for new version webpack
  devServer: { static: { directory: path.join(__dirname, "/") } },
  // for dev experience
  devtool: "inline-source-map",
  // how webpack bundles (deal with files)
  module: {
    rules: [
      // how to deal with ts files
      {
        // test each file and find if fits rules (reg)
        test: /\.ts$/, // end with .ts
        // handled by who
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
