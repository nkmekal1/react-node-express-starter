import express from 'express';
import path from 'path';
import expressHBS from 'express-hbs';
// import webpack from 'webpack';

const app = express();

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