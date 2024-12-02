const express = require('express');
const path = require('path');
const router = express.Router();
const hbs = require("hbs");
const root_dir = process.cwd();

const readfile = require(path.join(root_dir, './resources/js/readfile'));
const database = require(path.join(root_dir, './resources/js/database'));

// req is req from router.get()
function makeFilterQueryAndParameters(req)
{
    const { text, price_from, category, lumens_from, led_chip } = req.query;

    let is_there_error = false;
    let queryStr = ' WHERE 1=1'; // The `1=1` is just a placeholder to simplify the conditional logic
    let queryParams = [];

    // text: if there exists "text=" in req
    // text.trim() !== "": making sure it isn't empty or just space
    if (text && text.trim() !== "") 
    {
        queryStr += ` AND (PRODUCTS.display_name ILIKE $${queryParams.length + 1} OR PRODUCTS.description ILIKE $${queryParams.length + 1})`;
        queryParams.push(`%${text}%`);
    }

    if (price_from && !isNaN(price_from))
    {
        queryStr += ` AND PRODUCTS.price >= $${queryParams.length + 1}`;
        queryParams.push(price_from);
    }

    if (category && category.trim() !== "") 
    {
        queryStr += ` AND PRODUCTS.category ILIKE $${queryParams.length + 1}`;
        queryParams.push(category);
    }

    if (lumens_from && !isNaN(lumens_from))
    {
        queryStr += ` AND PRODUCTS.lumen >= $${queryParams.length + 1}`;
        queryParams.push(lumens_from);
    }

    if (led_chip && led_chip.trim() !== "")
    {
        queryStr += ` AND PRODUCTS.led_chip ILIKE $${queryParams.length + 1}`;
        queryParams.push(led_chip);
    }

    return { queryStr, queryParams, is_there_error };
}

async function processHandle(req)
{
    let message = "";

    /* Variable for setting user search text in search bar */
    let search_text = req.query.text;
    if (!search_text) // if user doesn't search, need to define this as empty string
    {
        search_text = "";
    }

    /* Database */
    // queryStr: query (query will be a reference if object ; will be a value copy if primitives)
    let { queryStr: condition_query, queryParams: query_parameters, is_there_error } = makeFilterQueryAndParameters(req);
    let products = await database.queryProducts(condition_query, query_parameters);

    /* In case found no product */
    if (products.length == 0)
    {
        message = "Found nothing";
    }

    return { search_text, message, products }
}

/* GET home page. */
router.get('/', async function (req, res, next)
{
    let search_text = ""; // reassign user search text again to top bar after moving to search page
    let message = ""; // if it is empty, then search found product(s)
    let products = [];

    // () outside is to destructering
    ({ search_text, message, products } = await processHandle(req));

    res.render('products/products', {
        message: message,
        product_list: products,

        title: 'Products',
        search_text: search_text,
    });
});

module.exports = router;