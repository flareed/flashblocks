const express = require("express");
const path = require("path");
const router = express.Router();
const hbs = require("hbs");

const root_dir = process.cwd();
// const readfile = require(path.join(root_dir, './resources/js/readfile'));
const database = require(path.join(root_dir, './resources/js/database.js'));

partial_path = path.join(__dirname, "partial");
hbs.registerPartials(partial_path);

/* GET home page. */;
router.get('/', async function (req, res, next)
{
    /* Database */
    const products_json = await database.queryProducts();

    // res.render('products/products', {
    //     product_list: products_json,
    //     layout: false
    // }, function (err, html)
    // {
    //     res.render('layout', {
    //         title: 'Products',
    //         content: html,  // Inject the rendered HTML of products.hbs
    //         layout: false  // Don't use a layout for this specific response
    //     })
    // })
    res.render('products/products', {
        product_list: products_json,

        title: 'Products',
    });
});

module.exports = router;
