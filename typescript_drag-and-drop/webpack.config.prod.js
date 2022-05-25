const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

// webpack configuration
module.exports = {
  mode: "production",
  // entry point (where project starts <app.ts>)
  entry: "./src/app.ts",
  output: {
    // content hash for caching in browser
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // for new version webpack
  devServer: { static: { directory: path.join(__dirname, "/") } },
  // for dev experience
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
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
