const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), //webpack wants an absolute path
  },
  devtool: "nosources-source-map", //"^nosources-source-map$"
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },

  plugins: [
    //applied to the general project
    new CleanPlugin.CleanWebpackPlugin(),
  ],
};
