'use strict';

const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index:'./src/index.js',
        search:'./src/search.js'
    },
    output: {
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:'babel-loader'
            },
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.less$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/\.(png|svg|jpg|gif|jpeg)$/,
                use:[
                    {
                        loader :'url-loader',
                        options:{
                            limit:10240
                        }
                    }
                ]
            },
            {
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    'file-loader'
                ]
            },

        ]
    }
}