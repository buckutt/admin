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
                    presets: ['es2015', 'stage-2'],
                    plugins: ['transform-runtime', 'add-module-exports']
                }
            },
            {
                test  : /\.css$/,
                loader: 'style-loader!css-loader?-url'
            }
        ]
    },

    resolveLoader: {
        root: path.join(__dirname, '/node_modules')
    },

    resolve: {
        extensions: ['', '.js'],
        alias     : {
            vue: 'vue/dist/vue.js'
        }
    },

    devServer: {
        contentBase: './public',
        hot        : true
    },

    babel: {
        presets: ['es2015', 'stage-2'],
        plugins: ['transform-runtime', 'add-module-exports']
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.DedupePlugin()
    ]
};
