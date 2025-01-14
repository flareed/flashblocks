const express = require('express');
const path = require('path');
const router = express.Router();
const passport = require('passport');

const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));
const helper = require(path.join(__dirname, "helper.js"));

/* GET home page. */
// Example:
// /login?view=forget
router.get('/', async function (req, res, next)
{
    let title = "";
    let filepath = "";
    let page_status =
    {
        isLoginPage: false,
        isForgetPage: false,
        is2faPage: false,
    }

    // login page
    if (req.url === "/")
    {
        title = "Login";
        filepath = "login/login.hbs";
        page_status.isLoginPage = true;
    }

    // /login?view=forget
    if (req.query.view && req.query.view === "forget")
    {
        title = "Forget password";
        filepath = "login/forget_password/forget_password.hbs";
        page_status.isForgetPage = true;
    }

    // /login?view=2fa
    if (req.query.view && req.query.view === "2fa")
    {
        title = "2FA";
        filepath = "login/2fa/2fa.hbs";
        page_status.is2faPage = true;
    }

    res.render(filepath, {
        title: title,
        isLoginPage: page_status.isLoginPage,
        isForgetPage: page_status.isForgetPage,
        is2faPage: page_status.is2faPage
    });
});

router.post('/', async function (req, res, next)
{
    let message = "";

    if (req.query.view && req.query.view === "forget")
    {
        message = await helper.processForgetPassword(req);
        res.json({ message: message });
    }

    if (req.url === '/')
    {
        passport.authenticate("local", (err, user, info) =>
        {
            // console.log(`User:`);
            // console.log(user);
            // console.log(`Info:`);
            // console.log(info);

            if (err)
            {
                return res.json({ message: "An error occurred during login" });
            }

            if (!user)
            {
                return res.json({ message: info.message || "Authentication failed" });
            }

            // Login successful, redirect to account/dashboard
            req.login(user, (err) =>
            {
                if (err)
                {
                    return res.json({ message: "An error occurred during session creation" });
                }

                console.log("User logged in successfully");

                message = "Logging in, redirecting in 3s";
                res.status(200).json({ message: message, redirect: true, redirectUrl: "/account", duration: 3000 });
            });
        })(req, res, next);
    }
});

module.exports = router;
