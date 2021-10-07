// @ts-check

const path = require('path');
const TsConfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        module: ['node_modules'],
        plugins: [
            new TsConfigPathsWebpackPlugin({
                configFile: path.resolve(__dirname, '../tsconfig.json')
            })
        ],
        alias: {
            "@core": path.resolve(__dirname, '..', 'src'),
            "@game": path.resolve(__dirname, '..', 'src', 'game'),
        }
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '..', 'dist'),
    }
};