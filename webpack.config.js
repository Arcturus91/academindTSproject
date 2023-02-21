const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), //webpack wants an absolute path
    publicPath: "/dist/",
  },
  devtool: "inline-source-map",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  devServer: {
    //webpack saves the file in the memory.
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
};
