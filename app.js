const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Static file location */
app.use('/files', express.static(path.join(__dirname, 'resources')));

/* View file location */
app.set('views', path.join(__dirname, 'public'));

/* Path handling here */
const index_handler = require('./public/index');
const products_handler = require('./public/products/products');
const product_page_handler = require('./public/products/product_detail');
const about_handler = require('./public/about/about');
const cart_handler = require('./public/cart/cart');
const contact_handler = require('./public/contact/contact');

const register_hanlder = require('./public/register/register');
const login_handler = require('./public/login/login');


app.use('/', index_handler);
app.use('/products', products_handler);
app.use('/product', product_page_handler);
app.use('/about', about_handler);
app.use('/cart', cart_handler);
app.use('/contact', contact_handler);
app.use('/register', register_hanlder);
app.use('/login', login_handler);
























app.use(function (req, res, next)
{
    next(createError(404));
    // res.status(404).send("Files not found")
});

// error handler
app.use(function (err, req, res, next)
{
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("layout", { title: "Error: page not found", content: `<div class="flex items-center justify-center md:min-h-[360px] md:text-xl xl:text-3xl">Page not found</div>` });
});

module.exports = app;
