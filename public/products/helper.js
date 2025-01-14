const path = require('path');

const root_dir = process.cwd();
const database = require(path.join(root_dir, './resources/js/database.js'));
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
        if (isNaN(page) || page < 1)
        {
            page = 1;
        }
        else
        {
            page = Number(page);
        }

        if (isNaN(limit) || limit < 1)
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
    let products = await database.queryProducts(condition_query, query_parameters);

    return { search_text, products, page, limit, page_count }
}

async function processProductDetail(productId)
{
    const query_condition = ` WHERE PRODUCTS.name ILIKE $1`;
    const same_category_query_condition = ` WHERE PRODUCTS.category = $1 AND PRODUCTS.name <> $2`;

    let same_category_products = [];
    let product = null;
    const products = await database.queryProductsJsonAgg(query_condition, [`%${productId}%`]);

    if (products.length === 0)
    {
        
    }
    else
    {
        product = products[0];
        same_category_products = await database.queryProductsJsonAgg(same_category_query_condition, [product.product_category, product.product_name]);
    }

    return { product, same_category_products };
}

module.exports =
{
    product_format, product_map_function, 
    makeFilterQueryAndParameters, processHandle, processProductDetail
}