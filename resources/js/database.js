const pgSession = require("connect-pg-simple");

const path = require('path');
const root_dir = process.cwd();
require(path.join(root_dir, "load_env.js"));
require(path.join(__dirname, '/database_query.js'));

const { Pool } = require('pg');

// Create a new client instance with your PostgreSQL connection details
const pool = new Pool({
    host: process.env.DB_HOST,    // Your host, usually 'localhost' or IP address
    port: process.env.DB_PORT,           // Default PostgreSQL port
    user: process.env.DB_USER, // Replace with your database username
    password: process.env.DB_PASSWORD,  // Replace with your database password
    database: process.env.DB_NAME   // Replace with your database name
});

function createExpressSession(session)
{
    const express_session_store = pgSession(session);
    return new express_session_store({
        pool: pool,                // Connection pool
        tableName: 'sessions',   // Use another table-name than the default "session" one
        ttl: 24 * 60 * 60, // Session expiration in seconds (24 hours)
        // Insert other connect-pg-simple options here
    });
}

// will return object
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
async function queryUsers(condition_query = "", parameters)
{
    let result = [];

    if (condition_query.trim() === "")
    {
        result = await query(DEFAULT_QUERY_ALL_USERS, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_ALL_USERS + condition_query, parameters);
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
async function queryProductsPagination(condition_query = "", parameters)
{
    let result = {};

    if (condition_query.trim() === "")
    {
        result = await query(DEFAULT_QUERY_ALL_PRODUCTS, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_ALL_PRODUCTS + condition_query, parameters);
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
async function queryProducts(condition_query = "", parameters)
{
    let result = {};

    if (condition_query.trim() === "")
    {
        result = await query(DEFAULT_QUERY_ALL_PRODUCTS_JSON, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_ALL_PRODUCTS_JSON + condition_query, parameters);
    }
    // console.log(DEFAULT_QUERY_ALL_PRODUCTS_JSON + condition_query);
    // console.log(parameters);

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

// will return JavaScript array
async function queryCart(condition_query = "", parameters)
{
    let result = [];

    if (condition_query.trim() === "")
    {
        result = await query(DEFAULT_QUERY_CART, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_CART + condition_query, parameters);
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

async function queryCategorys(condition_query = "", parameters)
{
    let result = [];

    if (condition_query.trim() === "")
    {
        result = await query(DEFAULT_QUERY_ALL_CATEGORIES, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_ALL_CATEGORIES + condition_query, parameters);
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

// will return object
async function getUserWithoutPasswordFromUsername(username)
{
    let result = {};

    const data = await query(" WHERE USERS.username = $1", [username]);

    if (data.length > 0)
    {
        result = data[0];
    }

    return result;
}

// will return boolean
async function isProductNameExists(product_name)
{
    let result = false;

    const data = await queryProducts(" WHERE PRODUCTS.name = $1", [product_name]);

    if (data.length > 0)
    {
        result = true;
    }

    return result;
}

// will return object
async function getCartRecord(username, product_name)
{
    let result = {};

    const data = await queryCart(" WHERE CART.username = $1 AND CART.product_name = $2", [username, product_name]);

    if (data.length > 0)
    {
        result = data[0];
    }

    return result;
}

// will return boolean
async function deleteCartRecord(username, product_name)
{
    const data = await query(DEFAULT_DELETE_CART_QUERY, [username, product_name]);

    return true;
}

// will return boolean
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

async function updateUserPassword(username, password)
{
    // let result = false;

    const temp = await query(DEFAULT_UPDATE_USER_PASSWORD_QUERY, [username, password]);

    return true;
}

async function updateUserDetail(username, address, creditcard)
{
    // let result = false;

    const temp = await query(DEFAULT_UPDATE_USER_DETAIL, [username, address, creditcard]);

    return true;
}

async function updateUserEmail(username, email)
{
    
}

// will return boolean
async function insertCartRecord(username, product_name, quantity)
{
    let result = false;

    const temp = await query(DEFAULT_INSERT_CART_QUERY, [username, product_name, quantity]);

    if (temp.rows != null)
    {
        console.log(temp.rows);
        result = true;
    }

    return result;
}

async function updateCartRecord(username, product_name, quantity)
{
    // let result = false;

    const temp = await query(DEFAULT_UPDATE_CART_QUERY, [username, product_name, quantity]);

    return true;
}

// will return JavaScript array
// innerjoin with products table for more detail
async function queryCartAdditional(condition_query = "", parameters)
{
    let result = [];

    const DEFAULT_QUERY_CART_2 = `
    SELECT CART.username, CART.product_name, CART.quantity, 
            PRODUCTS.display_name, PRODUCTS.imagepath, PRODUCTS.description, PRODUCTS.price
    `;

    const joining_query = ` 
        INNER JOIN public."PRODUCTS" AS PRODUCTS ON CART.product_name = PRODUCTS.name
    `;

    if (condition_query.trim() === "")
    {
        result = await query(DEFAULT_QUERY_CART + joining_query, parameters);
    }
    else
    {
        result = await query(DEFAULT_QUERY_CART + joining_query + condition_query, parameters);
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

module.exports =
{
    createExpressSession, 
    query, queryUsers, queryProducts, queryProductsPagination, queryCategorys, queryCart, 
    isUsernameExist, isEmailExist, getPasswordFromUsername, getUserFromUsername, isProductNameExists, 
    insertUser, updateUserPassword, updateUserDetail,
    getCartRecord, insertCartRecord, updateCartRecord, deleteCartRecord, queryCartAdditional
};