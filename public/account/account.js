const express = require('express');
const createError = require('http-errors')
const path = require('path');
const { title } = require('process');
const router = express.Router();

const root_dir = process.cwd();
const readfile = require(path.join(root_dir, './resources/js/readfile.js'));
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));

/* GET home page. */
router.get('/', async function (req, res, next)
{
    // console.log(`Is authenticated? ${req.isAuthenticated()}`);
    if (!req.isAuthenticated())
    {
        // return next(createError(401, "You need to log in before viewing this page"));
        return res.status(401).render("error_page.hbs", { title: "401 Unauthorized", error: "401 Unauthorized", message: "You need to login to view this page", layout: false });
    }

    const user = await database.getUserFromUsername(req.user.username);
    if (!user)
    {
        return res.status(404).json({ message: "User not found" });
    }

    res.render('account/account.hbs', {
        username: user.username,
        email: user.email,
        layout: false
    }, (err, html) => 
    {
        res.render('layout', { title: 'Account', content: html, isAccountPage: true });
    });
});

router.post('/', async function (req, res, next)
{
    console.log(req.query.action);
    console.log(req.body);

    if (req.query.action && req.query.action === "logout" && req.body.logout == true)
    {
        console.log("inside");
        message = "Logging out, redirecting in 3s";

        req.logout(function (err)
        {
            if (err)
            {
                return next(err)
            }
        });

        res.json({ message: message, redirect: true, redirectUrl: "/", duration: 3000 });
    }
});

module.exports = router;
