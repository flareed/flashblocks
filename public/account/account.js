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
        // const err = new Error('Unauthorized access');
        // err.status = 401;

        return next(createError(401, "You need to login"));
    }

    const user = await database.getUserFromUsername(req.user.username);
    if (!user)
    {
        return next(createError(400, "Username doesn't exist?"))
    }

    let title = "";
    let filepath = "";
    let isAdmin = false;
    let isAccountPage = false;
    let isAccountDetailPage = false;
    let isManageUsersPage = false;
    let isManageProductsPage = false;
    let isManageOrdersPage = false;

    if (req.user.role == "admin")
    {
        isAdmin = true;
    }

    if (req.url == "/")
    {
        title = "Account";
        filepath = "account/account.hbs";
        isAccountPage = true;
    }
    else if (req.url == "/?view=detail")
    {
        title = "Account Detail";
        filepath = "account/account_detail.hbs";
        isAccountDetailPage = true;
    }
    else if (isAdmin && req.url == "/?view=manage_users")
    {
        title = "Manager Users";
        filepath = "account/admin_manage_users.hbs";
        isManageUsersPage = true;
    }
    else if (isAdmin && req.url == "/?view=manage_products")
    {
        title = "Manage Products";
        filepath = "account/admin_manage_products.hbs";
        isManageProductsPage = true;
    }
    else if (isAdmin && req.url == "/?view=manage_orders")
    {
        title = "Manage Orders";
        filepath = "account/admin_manage_orders.hbs";
        isManageOrdersPage = true;
    }
    else
    {
        return next(createError(404, "Page not found"));
    }

    res.render(filepath, {
        username: user.username,
        email: user.email,

        title: title,
        address: user.address,
        creditcard: user.creditcard,
        isAdmin: isAdmin,
        isAccountPage: isAccountPage,
        isAccountDetailPage: isAccountDetailPage
    });
});

router.post('/', async function (req, res, next)
{
    // console.log(req.query.action);
    // console.log(req.body);
    let message = "";

    if (req.query.action)
    {
        if (req.query.action === "logout" && req.body.logout == true)
        {
            message = "Logging out, redirecting in 3s";

            req.logout(function (err)
            {
                if (err)
                {
                    return next(err)
                }
            });
        }

        if (req.query.action === "change_password")
        {
            const { username, password, new_password } = req.body;

            if (username.trim() == "")
            {
                message = "Unknown error";
            }
            else if (new_password.length < 6)
            {
                message = "Password is too short (min 6 chars)"
            }
            else
            {
                const password_from_db = await database.getPasswordFromUsername(username);
                const is_same_password = await hasher.compare(password, password_from_db);

                if (is_same_password)
                {
                    const hashed_password = await hasher.hash(new_password);
                    await database.updateUserPassword(username, hashed_password);

                    message = "Successfully updated password";
                }
            }

        }

        if (req.query.action === "update_detail")
        {
            const { address, credit_card: creditcard } = req.body;

            const username = req.user.username;
            const user = await database.getUserFromUsername(req.user.username);

            await database.updateUserDetail(username, address, creditcard)

            message = "Sucessfully updated detail";
        }

        res.json({ message: message, redirect: true, redirectUrl: "/", duration: 3000 });
    }
});

module.exports = router;
