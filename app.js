const path = require('path');
const createError = require('http-errors');
require(path.join(__dirname, "load_env.js"));
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const database = require(path.join(__dirname, "/resources/js/database.js"));
const mypassport = require(path.join(__dirname, "/resources/js/passport.js"));
const hbs = require("hbs");

const app = express();
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Handle bar helper */
hbs.registerHelper("eq", function (a, b) {
    return a === b;
});
hbs.registerHelper('formatDate', function(date) {
    // Format the date using the browser's locale settings
    return new Date(date).toLocaleString();
});

/* Static file location */
app.use('/files', express.static(path.join(__dirname, 'resources')));

/* View file location */
app.set('views', path.join(__dirname, 'public'));

/* express-session + passport */
app.use(session({
    store: database.createExpressSession(session),
    secret: process.env.SESSION_SECRET,  // Use a strong secret
    resave: false,
    saveUninitialized: false,
    cookie:
    {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        httpOnly: true, // Helps prevent XSS attacks
        secure: process.env.SECURE_COOKIE // Set to true if using https
    }   
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























/* Default path for everything else */
app.use(function (req, res, next)
{
    next(createError(404, "Page not found"));
});

/* Error handling (must have these 4 parameters in that order) */
app.use(function (err, req, res, next)
{
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    // res.status(err.status || 500);
    res.status(err.status).render("error.hbs", {content: `${err.message}`});
});

module.exports = app;
