'use strict';

const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');


const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.resolve(__dirname, './src/*/index.js'));
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index\.js/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(new HtmlWebpackPlugin({  // Also generate a test.html
            filename: `${pageName}.html`,
            template: path.resolve(__dirname, `src/${pageName}/index.html`),
            chunks: [pageName],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }));
    })
    return { entry, htmlWebpackPlugins };
}
const { entry, htmlWebpackPlugins } = setMPA();
module.exports = {
    mode: 'production',
    entry: entry,
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
                                            "Android 4.1",
                                            "iOS 7.1",
                                            "Chrome > 31",
                                            "ff > 31",
                                            "ie >= 8"
                                            //'last 10 versions', // 所有主流浏览器最近10版本用
                                        ],
                                        grid: true
                                    })
                                ]
                            }
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,//设计图的宽度/10 比如你的设计图是1920的宽度 这里你就1920/10=192
                            remPrecision: 8//换算的rem保留几位小数点
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
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'react',
                    entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
                    global: 'React',
                },
                {
                    module: 'react-dom',
                    entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
                    global: 'ReactDOM',
                },
            ],
        })
    ].concat(htmlWebpackPlugins),
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    chunks: 'all',
                    minChunks:2
                }
            }
        }
    }

}