import express from 'express';
import path from 'path';
import expressHBS from 'express-hbs';
import webpack from 'webpack';
import multer from 'multer';
import fs from 'fs';
import bodyParser from 'body-parser';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads`);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}|${Date.now()}|${file.originalname}`);
    }
});

const upload = multer({ storage });

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

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json({limit: '15mb'}));

app.post('/upload', upload.any(), (req, res) => {
    let base64Image = req.body.profileImage.split(';base64,').pop();
    fs.writeFile(`./uploads/${req.body.fileName}|${Date.now()}.png`, base64Image, {encoding: 'base64'}, function(err) {
        res.json('upload complete');
    }); 
});

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