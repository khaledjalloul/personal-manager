const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
var HtmlWebpackPlugin = require("html-webpack-plugin");

dotenv.config({ path: path.join(__dirname, `./.env.local`) });

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: [
          {
            loader: "ttf-loader",
            options: {
              name: "./font/[hash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
  mode: "development",
};
