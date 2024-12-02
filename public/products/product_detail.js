const express = require("express");
const path = require("path");
const router = express.Router();
const root_dir = process.cwd();

// const readfile = require(path.join(root_dir, './resources/js/readfile'));
const database = require(path.join(root_dir, './resources/js/database'));
const errorpage = require(path.join(root_dir, './resources/js/errorpage'));

// /product/:id
// /product is handled by app.use() already
router.get('/:id', async function (req, res)
{
    // /product/ghi
    // /product/abc_def_ghi
    // result will be "ghi" for both of those urls
    const productId = req.params.id.replace("_", " ");

    /* Product detail */
    const query_json_arr = database.QUERY_ALL_PRODUCTS_JSON + ` WHERE PRODUCTS.display_name ILIKE $1`;
    const parameters = [ `%${productId}` ];
    const products = await database.query(query_json_arr, parameters);

    if (products.length === 0)
    {
        errorpage.renderErrorPage(res, "Product not found");
        return;
    }
    const product = products[0];

    /* Products of same categories */
    const same_category_query_json_arr = database.QUERY_ALL_PRODUCTS_JSON + ` WHERE PRODUCTS.category = $1 AND PRODUCTS.name <> $2`;
    const same_category_products = await database.query(same_category_query_json_arr, [ product.product_category, product.product_name ]);
    // console.log(same_category_products);

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
