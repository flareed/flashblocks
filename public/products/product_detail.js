const express = require("express");
const path = require("path");
const router = express.Router();

const root_dir = process.cwd();
// const readfile = require(path.join(root_dir, './resources/js/readfile.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));
const errorpage = require(path.join(root_dir, './resources/js/errorpage.js'));

async function processHandle(productId)
{
    const query_condition = ` WHERE PRODUCTS.display_name ILIKE $1`;
    const same_category_query_condition = ` WHERE PRODUCTS.category = $1 AND PRODUCTS.name <> $2`;

    let same_category_products = [];
    let product = null;
    const products = await database.queryProducts(query_condition, [`%${productId}`]);

    if (products.length === 0)
    {

    }
    else
    {
        product = products[0];
        same_category_products = await database.queryProducts(same_category_query_condition, [product.product_category, product.product_name]);
    }

    return { product, same_category_products };
}

// /product/:id
// /product is handled by app.use() already
router.get('/:id', async function (req, res)
{
    const productId = req.params.id.replace("_", " ");
    let product = [];
    let same_category_products = [];

    ({ product, same_category_products } = await processHandle(productId));

    if (product === null)
    {
        errorpage.renderErrorPage(res, "Product not found");
        return;
    }

    res.render('products/product_detail', {
        product_name: product.product_name,
        product_brand: product.product_brand,
        product_display_name: product.product_display_name,
        product_description: product.product_description,
        product_category: product.product_category,
        product_price: product.product_price,
        product_image: product.product_image,
        product_led_chip: product.product_led_chip,
        product_max_lumens: product.product_max_lumens,
        product_battery: product.product_battery,
        same_category_products: same_category_products,
        layout: false
    }, function (err, html)
    {
        res.render('layout', {
            title: `${product.product_brand} ${product.product_name} ${product.product_category} `,
            content: html,
            layout: false
        })
    });
});

// Export the router
module.exports = router;
