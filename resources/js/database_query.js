
DEFAULT_QUERY_ALL_USERS = `
    SELECT *
    FROM public."USERS" AS USERS
`;

DEFAULT_QUERY_ALL_CATEGORIES = `
    SELECT *
    FROM public."CATEGORIES" AS CATEGORIES
`;

DEFAULT_QUERY_ALL_PRODUCTS_JSON = `
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

DEFAULT_QUERY_ALL_PRODUCTS = `
    Select *
    FROM public."PRODUCTS" AS PRODUCTS
`;

DEFAULT_QUERY_CART = `SELECT *
FROM public.cart AS CART
`;

DEFAULT_INSERT_USER_QUERY = `
    INSERT INTO public."USERS" (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
`;

DEFAULT_INSERT_CART_QUERY = `
    INSERT INTO public.cart (username, product_name, quantity) 
    VALUES ($1, $2, $3)
    RETURNING *;
`;

DEFAULT_UPDATE_USER_PASSWORD_QUERY = `
    UPDATE public."USERS"
    SET password = $2 
    WHERE username = $1;
`

DEFAULT_UPDATE_USER_DETAIL = `
    UPDATE public."USERS"
    SET address = $2, creditcard = $3
    WHERE username = $1;
`

DEFAULT_UPDATE_CART_QUERY = `
    UPDATE public.cart 
    SET quantity = $3 
    WHERE username = $1 AND product_name = $2;
`;

DEFAULT_DELETE_CART_QUERY = `
    DELETE FROM public.cart 
    WHERE username = $1 AND product_name = $2;
`;

DEFAULT_INSERT_PRODUCT = `
    INSERT INTO public."PRODUCTS" (name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, stock)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
`

DEFAULT_UPDATE_PRODUCT = `
    UPDATE public."PRODUCTS"
    SET
        display_name = $1,
        category = $2,
        price = $3,
        imagepath = $4,
        link = $5,
        battery = $6,
        lumen = $7,
        description = $8,
        led_chip = $9,
        brand = $10,
        stock = $11
    WHERE name = $12;
`;

DEFAULT_QUERY_ALL_ORDERS = `
    SELECT *
    FROM public.orders as ORDERS
`;

DEFAULT_INSERT_ORDER = `
    INSERT INTO public.orders ("user", created_date, status)
    VALUES ($1, NOW(), $2)
    RETURNING id;
`

DEFAULT_INSERT_PRODUCTLIST = `
    INSERT INTO public.productlist (id, productid, count, price_per)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
`