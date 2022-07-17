const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");

const devConfig = {
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: "./dist",
    hot: true,
    static: "errors-only",
  },
  devtool: 'cheap-source-map'
};

module.exports = merge(baseConfig, devConfig);
