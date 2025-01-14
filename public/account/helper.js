// left: the name
// right: database column name
const user_format = {
    username: "username",
    email: "email",
    role: "role",
    address: "address",
    creditcard: "creditcard"
};

const product_format = {
    product_id: "id",
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
    product_stock: "stock"
};

function map_function(row, format)
{
    const result = {};

    for (const [desiredColumn, originalColumn] of Object.entries(format))
    {
        result[desiredColumn] = row[originalColumn];
    }

    return result;
}

function makeManageOrdersFilterQuery(req)
{
    const { status, sort } = req.body;
    let queryStr = ' WHERE 1=1'; // The `1=1` is just a placeholder to simplify the conditional logic
    let queryParams = [];
    const username = req.user.username;
    const role = req.user.role;

    if (role && username && role === "user")
    {
        queryStr += ` AND ORDERS.user = $${queryParams.length + 1}`;
        queryParams.push(`${username}`);
    }

    if (status && status.trim() !== "") 
    {
        queryStr += ` AND ORDERS.status ILIKE $${queryParams.length + 1}`;
        queryParams.push(`${status}`);
    }

    if (sort) 
    {
        switch (sort)
        {
            case "id-asc":
                queryStr += ` ORDER BY ORDERS.id ASC`
                break;
            case "date-asc":
                queryStr += ` ORDER BY ORDERS.created_date ASC`
                break;
            case "date-desc":
                queryStr += ` ORDER BY ORDERS.created_date DESC`
                break;
        }
    }

    return { queryStr, queryParams };
}

function makeManageProductsFilterQuery(req)
{
    const { product_display_name, product_category, product_brand, sort } = req.body;
    let queryStr = ' WHERE 1=1'; // The `1=1` is just a placeholder to simplify the conditional logic
    let queryParams = [];

    if (product_display_name && product_display_name.trim() !== "") 
    {
        queryStr += ` AND PRODUCTS.display_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${product_display_name}%`);
    }

    if (product_category && product_category.trim() !== "") 
    {
        queryStr += ` AND PRODUCTS.category ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${product_category}%`);
    }

    if (product_brand && product_brand.trim() !== "") 
    {
        queryStr += ` AND PRODUCTS.brand ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${product_brand}%`);
    }

    if (sort) 
    {
        switch (sort)
        {
            case "name-asc":
                queryStr += ` ORDER BY PRODUCTS.name ASC`
                break;
            case "name-desc":
                queryStr += ` ORDER BY PRODUCTS.name DESC`
                break;
            case "price-asc":
                queryStr += ` ORDER BY PRODUCTS.price ASC`
                break;
            case "price-desc":
                queryStr += ` ORDER BY PRODUCTS.price DESC`
                break;
        }
    }

    return { queryStr, queryParams };
}

module.exports =
{
    user_format, product_format,
    map_function, makeManageOrdersFilterQuery, makeManageProductsFilterQuery
}