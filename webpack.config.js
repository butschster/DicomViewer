const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname + '/index.js'),
    output: {
        path: path.resolve(__dirname + '/dist/'),
        filename: 'dicom-viewer.min.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    'vue-loader',
                ]
            },
            {
                test: /\.js?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    externals: {
        jquery: 'jquery'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
    ]
};