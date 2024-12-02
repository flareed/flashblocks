const path = require('path');
const createError = require('http-errors');
const errorpage = require(path.join(__dirname, 'resources/js/errorpage'));
require(path.join(__dirname, "load_env.js"));
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mypassport = require(path.join(__dirname, "/resources/js/passport.js"));

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

/* express-session + passport */
app.use(session({
    // secret: process.env.SESSION_SECRET,  // Use a strong secret
    secret: "orangexdd",  // Use a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }   // Set to true if using https
}));

app.use(mypassport.initialize());
app.use(mypassport.session());

// Middleware to set isAuthenticated globally
app.use((req, res, next) =>
{
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

/* Path handling here */
const index_handler = require('./public/index.js');
const products_handler = require('./public/products/products.js');
const product_page_handler = require('./public/products/product_detail.js');
const search_handler = require('./public/search/search.js');

const about_handler = require('./public/about/about.js');
const cart_handler = require('./public/cart/cart.js');
const contact_handler = require('./public/contact/contact.js');
const register_hanlder = require('./public/register/register.js');
const login_handler = require('./public/login/login.js');
const account_handler = require('./public/account/account.js');


app.use('/', index_handler);
app.use('/products', products_handler);
app.use('/product', product_page_handler);
app.use('/search', search_handler)
app.use('/about', about_handler);
app.use('/cart', cart_handler);
app.use('/contact', contact_handler);


function Authenticated_handler(req, res, next)
{
    if (req.isAuthenticated())
    {
        // If user is authenticated, redirect to account page
        return res.redirect("/account");
    }
    next(); // Otherwise, proceed to the next handler
}

app.use('/register', Authenticated_handler, register_hanlder);
app.use('/login', Authenticated_handler, login_handler);
app.use('/account', account_handler);
























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
    errorpage.renderErrorPage(res, "Page not found");
    // res.render("error", { title: "Error: page not found", content: `Page not found` }, function(err, html)
});

module.exports = app;
