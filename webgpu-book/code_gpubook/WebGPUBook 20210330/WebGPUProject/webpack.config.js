const webpack = require('webpack');
const SourceMapDevToolPlugin = webpack.SourceMapDevToolPlugin;
const path = require("path");
const bundleOutputDir = "./public/dist";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        main: ["./ts/project/main.ts","./css/site.css"],    
        /*test: "./ts/project/test.ts",   
        ch02Triangle: './ts/project/ch02-triangle',
        ch02TriangleGlsl: './ts/project/ch02-triangle-glsl',
        ch03Points: './ts/project/ch03-points',   
        ch03Lines: './ts/project/ch03-lines',  
        ch03Triangles: './ts/project/ch03-triangles',
        ch04TriangleColor: './ts/project/ch04-triangle-color',
        ch04TriangleOneBuffer: './ts/project/ch04-triangle-one-buffer',
        ch04Square: './ts/project/ch04-square',
        ch04SquareIndex: './ts/project/ch04-square-index',
        ch05Transforms: './ts/project/ch05-transforms',
        ch05Projection: './ts/project/ch05-projection',
        ch06Line: './ts/project/ch06-line',
        ch06Cube: './ts/project/ch06-cube',
        ch06CubeVertexColor: './ts/project/ch06-cube-vertex-color', 
        ch07Cube: './ts/project/ch07-cube',
        ch07Sphere: './ts/project/ch07-sphere',
        ch07Cylinder: './ts/project/ch07-cylinder',
        ch07Cone: './ts/project/ch07-cone',
        ch07Torus: './ts/project/ch07-torus'
        ch08Cube: './ts/project/ch08-cube',
        ch08Sphere: './ts/project/ch08-sphere',
        ch08Cylinder: './ts/project/ch08-cylinder',
        ch08Cone: './ts/project/ch08-cone',
        ch08Torus: './ts/project/ch08-torus',
        ch09Sinc: './ts/project/ch09-sinc',
        ch09Exp: './ts/project/ch09-exp',
        ch09Peak: './ts/project/ch09-peak',
        ch09Helicoid: './ts/project/ch09-helicoid',
        ch09KleinBottle: './ts/project/ch09-klein-bottle',
        ch09Wellenkugel: './ts/project/ch09-wellenkugel',
        ch09RadialWave: './ts/project/ch09-radial-wave',
        ch10Cube: './ts/project/ch10-cube',
        ch10Sphere: './ts/project/ch10-sphere',
        ch10Cylinder: './ts/project/ch10-cylinder',
        ch10Sinc: './ts/project/ch10-sinc',
        ch10Peak: './ts/project/ch10-peak',
        ch10KleinBottle: './ts/project/ch10-klein-bottle',
        ch10Wellenkugel: './ts/project/ch10-wellenkugel',
        ch10CubeMultiple: './ts/project/ch10-cube-multiple',
        ch11Sinc: './ts/project/ch11-sinc',
        ch11Exp: './ts/project/ch11-exp',
        ch11Peak: './ts/project/ch11-peak',
        ch11KleinBottle: './ts/project/ch11-klein-bottle',
        ch11Wellenkugel: './ts/project/ch11-wellenkugel',
        ch11Sphere: './ts/project/ch11-sphere',
        ch11Torus: './ts/project/ch11-torus',
        ch12Complex3d: './ts/project/ch12-complex3d',
        ch12AnimateVertex: './ts/project/ch12-animate-vertex',
        ch12Fractal: './ts/project/ch12-fractal',
        ch12FractalShader: './ts/project/ch12-fractal-shader'
        ch13Multiple: './ts/project/ch13-multiple',
        ch13TwoObjects: './ts/project/ch13-two-objects',
        ch13Pipelines: './ts/project/ch13-pipelines',
        ch13PipelinesChart: './ts/project/ch13-pipelines-chart',
        ch13ChartAxes: './ts/project/ch13-chart-axes',
        ch14Compute: './ts/project/ch14-compute',
        ch14ComputeBoids: './ts/project/ch14-compute-boids',
        ch14Particles: './ts/project/ch14-particles',*/
    },
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname, bundleOutputDir),
        publicPath: 'public/dist/'
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.js', '.ts']
    },
    optimization: {
        minimizer: [
            new TerserPlugin({ test: /\.js(\?.*)?$/i }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    performance: {
        hints: false,
        maxEntrypointSize: 51200,
        maxAssetSize: 51200
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: ['/node_modules/']
            },            
            { test: /\.tsx?$/, loader: "ts-loader" },        
            {
                test: /\.css$/,
                sideEffects: true,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './'
                        }
                    },
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./public/dist/vendor-manifest.json')
        })].concat([
            new SourceMapDevToolPlugin({
                filename: '[file].map',
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]')
            }), new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            })
        ])
};

