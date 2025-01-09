const express = require('express');
const path = require('path');
const router = express.Router();
const hbs = require("hbs");
const root_dir = process.cwd();

const readfile = require(path.join(root_dir, '/resources/js/readfile.js'));
const database = require(path.join(root_dir, '/resources/js/database.js'));
const DEFAULT_PAGE_LIMIT = 2

// left: the name
// right: database column name
const product_format = {
    product_name: "name",
    product_brand: "brand",
    product_display_name: "display_name",
    product_category: "category",
    product_price: "price",
    product_image: "imagepath",
    product_link: "link",
    product_battery: "battery",
    product_max_lumens: "lumen",
    product_led_chip: "led_chip",
    product_description: "description",
};

function product_map_function(row, format)
{
    const mappedRow = {};

    for (const [desiredColumn, originalColumn] of Object.entries(format))
    {
        mappedRow[desiredColumn] = row[originalColumn];
    }

    return mappedRow;
}

// req is req from router.get()
function makeFilterQueryAndParameters(req)
{
    const { text, price_from, category, lumens_from, led_chip } = req.query;
    let { page = 1, limit = DEFAULT_PAGE_LIMIT } = req.query;
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

    if (category) 
    {
        queryStr += ` AND PRODUCTS.category ILIKE ANY ($${queryParams.length + 1})`;
        if (Array.isArray(category))
        {
            queryParams.push(category);
        }
        else if (category.trim() !== "")
        {
            queryParams.push([category]);
        }

    }

    if (lumens_from && !isNaN(lumens_from))
    {
        queryStr += ` AND PRODUCTS.lumen >= $${queryParams.length + 1}`;
        queryParams.push(lumens_from);
    }

    if (led_chip && led_chip.trim() !== "")
    {
        queryStr += ` AND PRODUCTS.led_chip ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${led_chip}%`);
    }

    if (page || limit)
    {
        if (isNaN(page) && page < 1)
        {
            page = 1;
        }
        else
        {
            page = Number(page);
        }

        if (isNaN(limit) && limit < 1)
        {
            limit = DEFAULT_PAGE_LIMIT;
        }
        else
        {
            limit = Number(limit);
        }

        // queryStr += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        // queryParams.push(limit, offset);
    }

    return { queryStr, queryParams, page, limit };
}

async function processHandle(req)
{
    /* Variable for setting user search text in search bar */
    let search_text = req.query.text;
    if (!search_text) // if user doesn't search, need to define this as empty string
    {
        search_text = "";
    }

    /* Database */
    // queryStr: query ( query will be a reference (if object) ; will be a value copy (if primitives) )
    let { queryStr: condition_query, queryParams: query_parameters, page, limit } = makeFilterQueryAndParameters(req);

    // Get totalpages
    const offset = (page - 1) * limit;
    const temp_query = `SELECT COUNT(*) FROM public."PRODUCTS" AS PRODUCTS`;
    const temp = await database.query(temp_query + condition_query, query_parameters);
    const product_count = parseInt(temp.rows[0].count, 10);
    const page_count = Math.ceil(product_count / limit);

    // Get the products
    condition_query += ` LIMIT $${query_parameters.length + 1} OFFSET $${query_parameters.length + 2}`;
    query_parameters.push(limit, offset);
    let products = await database.queryProductsPagination(condition_query, query_parameters);

    return { search_text, products, page, limit, page_count }
}

/* GET home page. */
router.get('/', async function (req, res, next)
{
    let search_text = ""; // reassign user search text again to top bar after moving to search page
    let products = [];

    // () outside is to destructering
    ({ search_text, products } = await processHandle(req));
    products = products.map( (row) => product_map_function(row, product_format) )
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

    ({ search_text, products, page, limit, page_count } = await processHandle(req));
    products = products.map( (row) => product_map_function(row, product_format) );

    const product_template_path = path.join(root_dir, "/public/products/partial/product.hbs")
    const product_template = await readfile.getFileContent(product_template_path);
    const products_json = JSON.stringify(products, null, 4); // string, replacer, tab_length

    console.log(`Current Page: ${page}`)
    console.log(`Limt: ${limit}`)
    console.log(`Total page: ${page_count}`)

    res.json({
        product_template: product_template,
        product_list: products_json,

        currentPage: parseInt(page),
        limit: parseInt(limit),
        pageCount: parseInt(page_count)
    });
});

module.exports = router;