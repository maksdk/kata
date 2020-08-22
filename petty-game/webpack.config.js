const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = () => ({
  entry: {
    main: './src/index.js'
  },
  devServer: {
    hot: false,
    inline: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html'
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  }
});