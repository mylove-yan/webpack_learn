'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer')({
                                        overrideBrowserslist: [
                                            "Android 4.1",
                                            "iOS 7.1",
                                            "Chrome > 31",
                                            "ff > 31",
                                            "ie >= 8"
                                            //'last 10 versions', // 所有主流浏览器最近10版本用
                                        ],
                                         grid: true
                                    })
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },

        ]
    },
    plugins: [
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            filename: "[name].[contenthash:8].css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new HtmlWebpackPlugin({  // Also generate a test.html
            filename: 'search.html',
            template: path.resolve(__dirname, 'src/search.html'),
            chunks: ['search'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }),
        new HtmlWebpackPlugin({  // Also generate a test.html
            filename: 'index.html',
            template: path.resolve(__dirname, 'src/index.html'),
            chunks: ['index'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        })
    ],

}