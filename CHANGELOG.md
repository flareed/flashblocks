# GA08
```
+ Added database_query.js file for default database queries (reduce line count on database.js)
+ Added handlebars.js in /files/js/
+ Added filtering UI (will also update the UI value when parsing from URL)

* Updated app.js to handle error the proper way with next()
* Updated "/products" & "/search" to use ajax for loading product list (server will send product_list_json & handlebar template for client to apply)
```

# After GA07 submission
```
* Updated cart page to use localStorage to retain checkboxes of products (so when removing a product, its checkbox state won't affect the product below moving up taking its place)
```

# GA07
```
+ Added pg-connect-simple module to allow saving user session longer and in database
+ Added cart page
+ Added ajax_utilities.js. This file will have utilitarian functions like showMessage() (shows a message on browser screen, like when added a product to cart : ) )

* Updated app.js to use the process.env variable for session_secret (I forgot :( )
* Updated product.hbs, product_detail.hbs to include product ID (product_name in database) for add_to_cart event
search.js uses products.hbs as a template so no need to update it
* Updated database to have role table & cart table (containing products in registered user cart ; so when logged out, won't lose cart detail)
```

# Before GA07
```
* Changed layout.hbs {{{content}}} tag to {{{body}}}, so can use res.render 1 time instead of nested res.render()
* Changed many .html files to .hbs extension to easier use res.render(<view>, { paramters: value })
```

# GA06
```
+ Added dotenv nodejs module (now can use dotenv to modify database related settings, express-session settings)
+ Added bcrypt module
+ Added passport & passport-js modules
+ Implemented login session with express-session & passport (LocalStrategy)

* Updated database_sql scripts
* Updated database.js to include more functions & queries
* Changed server_config folder to server_starter folder
* Changed layout to include message block to login & register
```