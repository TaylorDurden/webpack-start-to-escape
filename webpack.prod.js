"use strict";

const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const setMPA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
  const entryFiles = glob.sync("./src/*/index.js");

  for (const index in entryFiles) {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    console.log('match: ', match);
    const pageName = match && match[1];
    console.log('pageName: ', pageName);
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
    filename: "[name]_[chunkhash:8].js",
  },
  mode: "none",
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          "postcss-loader",
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75, // 1rem = 75px, 适用于750px的视觉稿
              remPrecision: 8, // px转换成rem时的小数点的位数
            },
          },
        ],
      },
      {
        test: /.(png|svg|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
      {},
    ],
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
    }),
    new CleanWebpackPlugin(),
  ].concat(HtmlWebpackPlugins),
  devtool: 'source-map'
};
