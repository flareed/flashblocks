const express = require('express');
const createError = require('http-errors')
const path = require('path');
const router = express.Router();

const root_dir = process.cwd();
const readfile = require(path.join(root_dir, './resources/js/readfile.js'));
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));
const helper = require(path.join(__dirname, "helper.js"));

/* GET home page. */
router.get('/', async function (req, res, next)
{
    if (!req.isAuthenticated())
    {
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
    let isManageProductsPage_Insert = false
    let isManageProductsPage_Update = false

    let users = [];
    let product = {};
    let products = [];
    let orders = [];

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

        users = await database.queryUsers();
        users = users.map((row) => helper.map_function(row, helper.user_format))

        isManageUsersPage = true;
    }
    else if (isAdmin && req.url == "/?view=manage_products")
    {
        title = "Manage Products";
        filepath = "account/admin_manage_products.hbs";

        products = await database.queryProducts();

        products = products.map((row) => helper.map_function(row, helper.product_format))
        isManageProductsPage = true;
    }
    else if (isAdmin && req.url == "/?view=manage_orders")
    {
        title = "Manage Orders";
        filepath = "account/admin_manage_orders.hbs";

        orders = await database.queryOrders(" ORDER BY ORDERS.id ASC");

        isManageOrdersPage = true;
    }
    else if (req.url == "/?view=manage_orders")
    {
        title = "Manage Orders";
        filepath = "account/admin_manage_orders.hbs";

        orders = await database.queryOrders(` WHERE ORDERS.user = $1` + " ORDER BY ORDERS.id ASC", [user.username]);

        isManageOrdersPage = true;
    }
    else if (isAdmin && req.query.view && req.query.id && req.query.id.trim() != "")
    {
        title = "Manage Orders";
        filepath = "account/admin_manage_products_update.hbs";

        product = await database.queryProducts(" WHERE PRODUCTS.name = $1", [req.query.id]);

        if (product.length < 1)
        {
            return next(createError(404, "Product not found"));
        }

        product = product.map((row) => helper.map_function(row, helper.product_format))[0];
        isManageProductsPage_Update = true;
    }
    else if (isAdmin && req.query.view && req.query.action && req.query.action.trim() == "insert")
    {
        title = "Manage Orders";
        filepath = "account/admin_manage_products_update.hbs";

        isManageProductsPage_Insert = true;
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

        users: users,
        product: product,
        products: products,
        orders: orders,
        isAdmin: isAdmin,
        isAccountPage: isAccountPage,
        isAccountDetailPage: isAccountDetailPage,
        isManageUsersPage: isManageUsersPage,
        isManageProductsPage: isManageProductsPage,
        isManageOrdersPage: isManageOrdersPage,
        isManageProductsPage_Insert: isManageProductsPage_Insert,
        isManageProductsPage_Update: isManageProductsPage_Update
    });
});

router.post('/', async function (req, res, next)
{
    let message = "";

    if (req.query.action)
    {
        // /account?action=logout
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

            res.json({ message: message, redirect: true, redirectUrl: "/", duration: 3000 });
        }

        // /account?action=change_password
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
                else
                {
                    message = "Current password is wrong";
                }
            }

            res.json({ message: message });
        }

        // /account?action=update_detail
        if (req.query.action === "update_detail")
        {
            const { address, credit_card: creditcard } = req.body;

            const username = req.user.username;
            const user = await database.getUserFromUsername(req.user.username);

            await database.updateUserDetail(username, address, creditcard)

            message = "Sucessfully updated detail";

            return res.json({ message: message });
        }

        // /account?view=manage_products&action=filter
        if (req.query.view && req.query.view == "manage_products" && req.query.action === "filter")
        {
            const { queryStr: query, queryParams: params } = helper.makeManageProductsFilterQuery(req);

            let products = await database.queryProducts(query, params);
            products = products.map((row) => helper.map_function(row, helper.product_format));

            return res.json({ products });
        }

        // /account?view=manage_orders&action=filter
        if (req.query.view && req.query.view == "manage_orders" && req.query.action === "filter")
        {
            const { queryStr: query, queryParams: params } = helper.makeManageOrdersFilterQuery(req);

            let orders = await database.queryOrders(query, params);

            return res.json({ orders });
        }

        // /account?view=manage_products&action=update
        if (req.query.view && req.query.view == "manage_products" && req.query.action === "update")
        {
            const data = {
                display_name,
                category,
                price,
                imagepath,
                link,
                battery,
                lumen,
                description,
                led_chip,
                brand,
                stock
            } = req.body;
            const product_name = req.body.name;

            await database.updateProduct(product_name, data);

            return res.json({ message: "Changed" });
        }

        // /account?view=manage_products&action=insert
        if (req.query.view && req.query.view == "manage_products" && req.query.action === "insert")
        {
            const data = {
                name,
                display_name,
                category,
                price,
                imagepath,
                link,
                battery,
                lumen,
                description,
                led_chip,
                brand,
                stock
            } = req.body;
            if (data.stock == "")
            {
                data.stock = 1;
            }
            if (data.lumen == "")
            {
                data.lumen = 1;
            }

            const isProductNameExists = await database.isProductNameExists(data.name);
            if (isProductNameExists)
            {
                return res.json({ message: "Product name already existed" });
            }

            const isSuccessful = await database.insertProduct(data);
            if (!isSuccessful)
            {
                return res.json({ message: "Error, can't add product" });
            }

            return res.json({ message: "Added" });
        }
    }
});

module.exports = router;
