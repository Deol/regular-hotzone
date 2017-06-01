let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let env = (process.env.NODE_ENV || 'development').trim();
let isProd = env !== 'development';

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'hotzone.min.js'
    },
    module: {
        rules: [
            {
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
                    comments: !isProd,              // 开发环境开启注释
                    cacheDirectory: !isProd,        // 开发环境开启缓存
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
                loader: isProd ? ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!mcss-loader'
                }) : 'style-loader!css-loader!mcss-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: isProd ? ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }) : 'style-loader!css-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        regularjs: 'window.Regular'
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
    devtool: '#eval-source-map'
};

if (isProd) {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            }
        }),
        new ExtractTextPlugin({
            filename: 'hotzone.min.css',
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            comments: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}
