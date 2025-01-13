const express = require("express");
const path = require("path");
const router = express.Router();
const hbs = require("hbs");

const root_dir = process.cwd();
// const readfile = require(path.join(root_dir, './resources/js/readfile'));
const database = require(path.join(root_dir, './resources/js/database.js'));
const helper = require(path.join(root_dir, '/public/products/helper.js'));

partial_path = path.join(__dirname, "partial");
hbs.registerPartials(partial_path);

/* GET home page. */
router.get('/', async function (req, res, next)
{
    let search_text = ""; // reassign user search text again to top bar after moving to search page
    let products = [];

    // () outside is to destructering
    ({ search_text, products } = await helper.processHandle(req));
    products = products.map( (row) => helper.product_map_function(row, helper.product_format) )
    console.log(products);

    res.render('products/products', {
        product_list: products,

        title: 'Products',
        search_text: "",
        client_needHandlebars: true,
        needFiltering: true,
        needUtilities: true,
        needAddtoCart: true
    });
});

module.exports = router;
