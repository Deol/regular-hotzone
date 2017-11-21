'use strict';
let path = require('path');
let webpack = require('webpack');

module.exports = {
    entry: { hotzone: './src/index.js' },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].total.js',
        library: 'regularHotZone',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.html$/,
            // html-loader 导致 regular 解析出问题（<> 等特殊运算符会被转译）
            // 是否压缩的总开关，false 为关闭，关闭后效果完全等价于 raw-loader
            loaders: [`rgl-tplmin-loader?${JSON.stringify({
                minimize: true,
                comments: {
                    html: false
                }
            })}`],
            exclude: /node_modules/
        },
        {
            test: /\.js$/,
            loaders: [`babel-loader?${JSON.stringify({
                presets: ['es2015', 'stage-2'],
                plugins: ['transform-runtime'],
                comments: false,
                cacheDirectory: false,
                compact: true
            })}`],
            exclude: /node_modules/
        },
        {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]?[hash]'
            }
        },
        {
            test: /\.mcss$/,
            loader: 'style-loader!css-loader!mcss-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
            exclude: /node_modules/
        }
        ]
    },
    externals: {
        regularjs: {
            root: 'Regular',
            commonjs: 'regularjs',
            commonjs2: 'regularjs',
            amd: 'regularjs'
        }
    },
    resolve: {
        extensions: ['.js', '.css', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        hot: true
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            comments: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]
};