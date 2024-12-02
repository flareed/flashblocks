const { Pool } = require('pg');

// Create a new client instance with your PostgreSQL connection details
const pool = new Pool({
    host: '192.168.0.9',    // Your host, usually 'localhost' or IP address
    port: 5432,           // Default PostgreSQL port
    user: 'Link', // Replace with your database username
    password: 'tenniner',  // Replace with your database password
    database: 'flashblocks'   // Replace with your database name
});

const QUERY_ALL_PRODUCTS_JSON = `
    SELECT json_agg(json_build_object(
        'product_name', name,
        'product_brand', brand,
        'product_display_name', display_name,
        'product_category', category,
        'product_price', price,
        'product_image', imagepath,
        'product_link', link,
        'product_battery', battery,
        'product_max_lumens', lumen,
        'product_led_chip', led_chip,
        'product_description', description
    )) AS content
    FROM public."PRODUCTS" AS PRODUCTS
`;

const QUERY_ALL_PRODUCTS = `
    Select *
    FROM public."PRODUCTS" AS PRODUCTS
`;

async function query(query, parameters)
{
    let result = ""
    try
    {
        console.log("Getting a client from pool");
        const client = await pool.connect();

        if (parameters !== "undefined")
        {
            result = await client.query(query, parameters);
        }
        else
        {
            result = await client.query(query);
        }

        console.log("Releasing the client to pool");
        client.release()
    }
    catch (err)
    {
        console.error('Error:', err.stack);
    }

    // handling no result from query
    let products = [];
    if (result && result.rows.length > 0 && result.rows[0].content !== null) 
    {
        console.log("Query found row(s)");
        products = result.rows[0].content;
    }

    return products
    // return JSON(products, null, 4) // string, replacer, tab_length
}

module.exports =
{
    query, QUERY_ALL_PRODUCTS_JSON
};