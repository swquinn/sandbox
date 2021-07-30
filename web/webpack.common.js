const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
    entry: {
        'app': './src/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/build/'),
        filename: 'js/[name]-[chunkhash].min.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]_[local]_[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader' }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackAssetsManifest({
            output: 'manifest.json',
        })
    ],
    resolve: {
        alias: {
            'app': path.resolve(__dirname, 'src/')
        },
        extensions: ['.js', '.jsx', '.css'],
        modules: [
            path.resolve(__dirname, 'src/'),
            'node_modules'
        ]
    },
};
