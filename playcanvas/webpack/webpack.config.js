// @ts-check

const path = require('path');
const PlayCanvasWebpackPlugin = require('./playcanvasWebpackPlugin');
const TsConfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

const pcConfig = {
    skipUpload: false,
    bearer: "2ta8dyo8hjsvpry5tj0745uw3nl4xmc2",
    projectId: "1133132",
    branchId: "e1aa4ac8-aaf3-4079-8e2a-2fbb718e627f",
    mode: "update",
    files: {
        'main.js': {
            path: 'main.js',
            assetId: 46108741
        }
    }
};

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
            // @ts-ignore
            new TsConfigPathsWebpackPlugin({
                configFilr: path.resolve(__dirname, '../tsconfig.json')
            })
        ],
        alias: {
            "@core": path.resolve(__dirname, '..', 'src', 'core'),
            "@types": path.resolve(__dirname, '..', 'src', 'types'),
            "@game": path.resolve(__dirname, '..', 'src', 'game'),
        }
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new PlayCanvasWebpackPlugin(pcConfig)
    ]
};