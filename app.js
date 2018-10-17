import express from 'express';
import path from 'path';
import expressHBS from 'express-hbs';
import webpack from 'webpack';

const app = express();

const webpackLocConfig = require('./webpack.config.loc').default;
const webpackObj = {
    devMiddleware: require('webpack-dev-middleware'),
    config: webpackLocConfig,
    hotMiddleware: require('webpack-hot-middleware')
};
const compiler = webpack(webpackObj.config);
app.use(webpackObj.devMiddleware(compiler, {
    noInfo: true,
    stats: 'errors-only',
    publicPath: webpackLocConfig.output.publicPath
}));
app.use(webpackObj.hotMiddleware(compiler));

app.engine('hbs', expressHBS.express4({
    partialsDir: path.resolve('./src/server/views/partials'),
    layoutsDir: path.resolve('./src/server/views/layouts')
}));

app.get('*', (req, res) => {
    res.render('home');
});

app.set('view engine', 'hbs');
app.set('views', path.resolve('./src/server/views'));

app.listen(8081, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log('App is running');
    }
});