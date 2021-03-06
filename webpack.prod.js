'use strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const smwp = new SpeedMeasureWebpackPlugin();

const setMPA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
  const entryFiles = glob.sync('./src/*/index.js');

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
        chunks: ['vendors', pageName],
        inject: true,
        scriptLoading: 'blocking',
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

module.exports = smwp.wrap({
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          },
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader',
          {
            loader: 'px2rem-loader',
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
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
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
    // new MiniCssExtractPlugin({
    //   filename: "[name]_[contenthash:8].css",
    // }),
    new CleanWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
    new BundleAnalyzerPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require('./build/library/library.json')
    })
  ].concat(HtmlWebpackPlugins),
  optimization: {
    minimizer: [new UglifyJsPlugin(), new TerserPlugin({ parallel: 4 })],
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
  stats: 'errors-only',
});
