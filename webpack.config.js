const path    = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/app.js'
    ],

    output: {
        path      : path.join(__dirname, '/public'),
        publicPath: '/',
        filename  : 'bundle.js'
    },

    devtool: 'source-map',

    module: {
        loaders: [
            {
                test  : /\.vue$/,
                loader: 'vue'
            },
            {
                test   : /\.js$/,
                loader : 'babel',
                exclude: /node_modules/,
                query  : {
                    presets: ['es2015']
                }
            },
            {
                test  : /\.css$/,
                loader: 'style-loader!css-loader?-url'
            }
        ]
    },

    resolveLoader: {
        root: path.join(__dirname, '/node_modules'),
    },

    resolve: {
        extensions: ['', '.js']
    },

    devServer: {
        contentBase: './public',
        hot        : true
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.DedupePlugin()
    ]
};
