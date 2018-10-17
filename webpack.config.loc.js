import webpack from 'webpack';

export default {
    mode: 'development',
    devtool: 'cheap-source-map',
    entry: {
        'home-page-app': [ 'webpack/hot/dev-server', 'webpack-hot-middleware/client?reload=true', './src/client/js/home-page-app/App.js']
    },
    target: 'web',
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: '[name].js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.css?$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader']
          }
        ]
    }
};
