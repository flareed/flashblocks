const express = require("express");
const createError = require('http-errors')
const path = require("path");
const router = express.Router();

const root_dir = process.cwd();
const helper = require(path.join(__dirname, 'helper.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));

// /product/:id
// /product is handled by app.use() already
router.get('/:id', async function (req, res, next)
{
    const productId = req.params.id.replace("_", " ");
    let product = [];
    let same_category_products = [];

    ({ product, same_category_products } = await helper.processProductDetail(productId));

    if (product === null)
    {
        return next(createError(404, "Product not found"));
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

        title: `${product.product_brand} ${product.product_name} ${product.product_category}`,
        needUtilities: true,
        needAddtoCart: true
    });
});

// Export the router
module.exports = router;
