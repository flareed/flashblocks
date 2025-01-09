
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

DEFAULT_UPDATE_CART_QUERY = `
    UPDATE public.cart 
    SET quantity = $3 
    WHERE username = $1 AND product_name = $2;
`;

DEFAULT_DELETE_CART_QUERY = `
    DELETE FROM public.cart 
    WHERE username = $1 AND product_name = $2;
`;

