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

/* GET home page. */
router.get('/', async function (req, res, next)
{
    let message = "";

    /* Variable for setting user search text in search bar */
    let search_text = req.query.text;
    if (!search_text)
    {
        search_text = "";
    }

    /* Database */
    // queryStr: query (query is reference for object ; value copy for primitives)
    let { queryStr: query, queryParams: query_parameters, is_there_error } = makeFilterQueryAndParameters(req);
    query = database.QUERY_ALL_PRODUCTS_JSON + query;
    let products = await database.query(query, query_parameters);
    
    /* In case found no product */
    if (products.length == 0)
    {
        message = "Found nothing";
    }

    res.render('products/products', {
        message, message,
        product_list: products,
        layout: false
    }, function (err, html)
    {
        res.render('layout', {
            title: 'Products',
            search_text: search_text,
            content: html,  // Inject the rendered HTML of products.hbs
            layout: false  // Don't use a layout for this specific response
        })
    })
});

module.exports = router;