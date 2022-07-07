"use strict";

const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const setMPA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
  const entryFiles = glob.sync("./src/*/index.js");

  for (const index in entryFiles) {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    console.log("match: ", match);
    const pageName = match && match[1];
    console.log("pageName: ", pageName);
    entry[pageName] = entryFile;
    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${[pageName]}.html`,
        chunks: [pageName],
        inject: true,
        scriptLoading: "blocking",
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      })
    );
  }

  return {
    entry,
    HtmlWebpackPlugins,
  };
};

const { entry, HtmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /.(png|svg|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ].concat(HtmlWebpackPlugins),
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
  },
  devtool: 'source-map'
};
