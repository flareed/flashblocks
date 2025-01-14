const express = require('express');
const path = require('path');
const router = express.Router();

const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));

/* GET home page. */
router.get('/', async function (req, res, next)
{
    let products = [];

    if (req.isAuthenticated())
    {
        const username = req.user.username;

        cartRecords = await database.queryCartAdditional(" WHERE CART.username = $1", [username]);
        // console.log(cartRecords);

        if (cartRecords.length > 0)
        {
            products = cartRecords;
        }
    }

    res.render('cart/cart.hbs', {
        title: 'Shopping cart',
        products: products,

        isCartPage: true,
        needUtilities: true
    });
});

router.post('/', async function (req, res, next)
{
    if (!req.isAuthenticated())
    {
        console.log("Not authenticated in cart page");
        res.status(401).json({ message: "You need to log in before adding to cart" });
        return;
    }

    const username = req.user.username;
    const { action, id: product_name, quantity } = req.query;

    // Ex: /cart?action=add&id=SC18
    if (action && action === "add" && product_name && await database.isProductNameExists(product_name))
    {
        const cartRecord = await database.getCartRecord(username, product_name)

        // if there no data, insert
        if (Object.keys(cartRecord).length < 1)
        {
            console.log("Inserting new cart record");
            const result = await database.insertCartRecord(username, product_name, 1);

            if (result == false)
            {
                return res.status(200).json({ message: `Error, can't add product to cart` });
            }
        }
        // if there data, update quantity
        else
        {
            console.log("Updating existing cart record");
            await database.updateCartRecord(username, product_name, cartRecord.quantity + 1);
        }

        res.status(200).json({ message: `Added ${product_name} to cart` });
    }
    // Ex: /cart?action=delete&id=SC18
    else if (action && action === "delete" && product_name && await database.isProductNameExists(product_name))
    {
        console.log("Deleting record");
        await database.deleteCartRecord(username, product_name);

        res.status(200).json({ message: `Deleted ${product_name} from cart` });
    }
    else if (action && action === "update" && product_name && await database.isProductNameExists(product_name) && quantity && !isNaN(quantity))
    {
        await database.updateCartRecord(username, product_name, quantity);;

        res.status(200).json({ message: `Updated ${product_name} from cart` });
    }
    else if (action && action === "order")
    {
        let products = req.body.products;

        if (!Array.isArray(products))
        {
            return res.status(400).json({ message: "Invalid data format. Expected an array of products." });
        }

        const { orderid, result: order_result } = await database.insertOrder(username, "pending");
        if (!order_result)
        {
            return res.status(500).json({ message: "Something is wrong" });
        }

        let isThereError = false;
        products.forEach(async (product) =>
        {
            const temp = await database.insertProductOrder(orderid, product.product_id, product.product_quantity, product.product_price);
            if (!temp)
            {
                isThereError = false;
            }
        });

        if (isThereError)
        {
            return res.status(500).json({ message: "Something is wrong" });
        }

        res.status(200).json({ message: "Successfully added" });
    }
    else
    {
        res.status(500).json({ message: "Something is wrong" });
    }
});

module.exports = router;
