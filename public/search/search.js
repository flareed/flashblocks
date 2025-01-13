const express = require('express');
const path = require('path');
const router = express.Router();
const hbs = require("hbs");
const root_dir = process.cwd();

const readfile = require(path.join(root_dir, '/resources/js/readfile.js'));
const database = require(path.join(root_dir, '/resources/js/database.js'));
const helper = require(path.join(root_dir, '/public/products/helper.js'));

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

router.post('/', async function (req, res, next)
{
    let products = [];

    ({ search_text, products, page, limit, page_count } = await helper.processHandle(req));
    products = products.map( (row) => helper.product_map_function(row, helper.product_format) );

    const product_template_path = path.join(root_dir, "/public/products/partial/product.hbs")
    const product_template = await readfile.getFileContent(product_template_path);
    const products_json = JSON.stringify(products, null, 4); // string, replacer, tab_length

    // console.log(`Current Page: ${page}`)
    // console.log(`Limt: ${limit}`)
    // console.log(`Total page: ${page_count}`)

    res.json({
        product_template: product_template,
        product_list: products_json,

        currentPage: parseInt(page),
        limit: parseInt(limit),
        pageCount: parseInt(page_count)
    });
});

module.exports = router;