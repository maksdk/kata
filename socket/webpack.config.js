//@ts-check
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env={}, arg={}) => {
    return {
        entry: { main: './client/index.js' },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.js'
        },
        plugins:[
            // new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'client', 'index.html'),
                filename: 'index.html'
            })
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        }
    };
};  