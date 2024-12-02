const path = require('path');
const root_dir = process.cwd();
require(path.join(root_dir, "load_env.js"));

const { Pool } = require('pg');

// Create a new client instance with your PostgreSQL connection details
const pool = new Pool({
    host: process.env.DB_HOST,    // Your host, usually 'localhost' or IP address
    port: process.env.DB_PORT,           // Default PostgreSQL port
    user: process.env.DB_USER, // Replace with your database username
    password: process.env.DB_PASSWORD,  // Replace with your database password
    database: process.env.DB_NAME   // Replace with your database name
});

const DEFAULT_INSERT_USER_QUERY = `
    INSERT INTO public."USERS" (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
`;

const DEFAULT_QUERY_ALL_USERS = `
    SELECT *
    FROM public."USERS" AS USERS
`;

const DEFAULT_QUERY_ALL_PRODUCTS_JSON = `
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

const DEFAULT_QUERY_ALL_PRODUCTS = `
    Select *
    FROM public."PRODUCTS" AS PRODUCTS
`;

async function isUsernameExist(username)
{
    let result = false;

    const data = await queryUsers(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        // console.log(data);
        result = true;
    }

    return result;
}

async function isEmailExist(email)
{
    let result = false;

    const data = await queryUsers(" WHERE USERS.email = $1", [email]);

    if (data.length > 0)
    {
        result = true;
    }

    return result;
}

// will return string
async function getPasswordFromUsername(username)
{
    let result = "";

    const data = await queryUsers(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        result = data[0].password;
    }

    return result;
}

// will return object
async function getUserFromUsername(username)
{
    let result = {};

    const data = await queryUsers(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        result = data[0];
    }

    return result;
}

async function getUserWithoutPasswordFromUsername(username)
{
    let result = {};

    SELECT 
    const data = await query(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        result = data[0];
    }

    return result;
}

async function insertUser(username, email, password)
{
    let result = false;

    const temp = await query(DEFAULT_INSERT_USER_QUERY, [username, email, password]);

    if (temp.rows != null)
    {
        console.log(temp.rows);
        result = true;
    }

    return result;
}

async function query(query, parameters)
{
    let result = "";

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

    return result;
}

// will return JavaScript array
async function queryUsers(condition_query_str = "", parameters)
{
    let result = [];

    if (condition_query_str.trim() === "")
    {
        result = await query(DEFAULT_QUERY_ALL_USERS, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_ALL_USERS + condition_query_str, parameters);
    }

    // handle no result from query
    if (result.rows == null)
    {
        result = [];
    }
    else
    {
        result = result.rows; // content returned from postgresql
    }

    result = Array.from(result); // converts to javascript array
    return result;
}

// will return JavaScript array
async function queryProducts(condition_query_str = "", parameters)
{
    let result = [];

    if (condition_query_str.trim() === "")
    {
        result = await query(DEFAULT_QUERY_ALL_PRODUCTS_JSON, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_ALL_PRODUCTS_JSON + condition_query_str, parameters);
    }

    let products = [];
    // handling no result from query
    if (result && result.rows.length > 0 && result.rows[0].content !== null) 
    {
        console.log("Query found row(s)");
        products = result.rows[0].content;
        // console.log(typeof(products));
    }

    products = Array.from(products); // converts to javascript array
    return products;
    // Stringify json array object
    // return JSON(products, null, 4) // string, replacer, tab_length
}

module.exports =
{
    query, queryUsers, queryProducts, insertUser, isUsernameExist, isEmailExist, getPasswordFromUsername, getUserFromUsername
};