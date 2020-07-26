//@ts-check
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { config } = require('process');

module.exports = (env={}, arg={}) => {
    const common = {
        entry: { main: './client/index.js' },
        plugins:[
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

    const config1 = {
        ...common,
        output: {
            path: path.resolve(__dirname, 'dist1'),
            filename: 'main.js'
        },
    };

    const config2 = {
        ...common,
        output: {
            path: path.resolve(__dirname, 'dist2'),
            filename: 'main.js'
        },
    }
    return [config1, config2];
};  