"use strict";

const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

const setMPA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
  const entryFiles = glob.sync("./src/*/index-server.js");

  for (const index in entryFiles) {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index-server\.js/);
    console.log("match: ", match);
    const pageName = match && match[1];
    console.log("pageName: ", pageName);
    if (pageName) {
      entry[pageName] = entryFile;
      HtmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${[pageName]}.html`,
          chunks: ["vendors", pageName],
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
    filename: "[name]-server.js",
    globalObject: 'this',
    libraryTarget: "umd",
    publicPath: "./"
  },
  mode: "none",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
          // "postcss-loader",
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75, // 1rem = 75px, ?????????750px????????????
              remPrecision: 8, // px?????????rem????????????????????????
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
        use: {
          loader: "file-loader",
          options: {
            publicPath: "./"
          }
        },
      },
      {},
    ],
  },
  // optimization: {
  //   minimizer: [
  //     // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
  //     // `...`,
  //     new CssMinimizerPlugin(),
  //   ],
  // },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
    }),
    // new CleanWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "react",
          entry: "https://now8.gtimg.com/now/lib/16.8.6/react.min.js",
          global: "React",
        },
        {
          module: "react-dom",
          entry: "https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js",
          global: "ReactDOM",
        },
      ],
    }),
  ].concat(HtmlWebpackPlugins),
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  // optimization: {
  //   splitChunks: {
  //     minSize: 0,
  //     cacheGroups: {
  //       commons: {
  //         name: 'commons',
  //         chunks: 'all',
  //         minChunks: 2, // ??????????????????2??????????????????????????????
  //       }
  //     },
  //   },
  // },
};
