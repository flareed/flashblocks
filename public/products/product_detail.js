const express = require("express");
const path = require("path");
const router = express.Router();

const myarray = [
    {
        product_name: "SC18",
        product_category: "EDC Flashlight",
        product_description: "Very long description text, don't ask why it is this long. I have no idea either ¯\_(ツ)_/¯",
        product_image: "/files/images/edc_sc18.webp",
        product_led_chip: "SST-40",
        product_max_lumens: "1800",
        product_battery: "18650",
        product_price: 16.99,
        product_link: "/product/edc_sc18"
    },
    {
        product_name: "C8G",
        product_category: "Tactical Flashlight",
        product_description: "This is a description of product 2.",
        product_image: "/files/images/tactical_c8g.webp",
        product_led_chip: "SST-40",
        product_max_lumens: "2000",
        product_battery: "18650/21700",
        product_price: 24.99,
        product_link: "/product/tactical_c8g"
    },
    {
        product_name: "C8L",
        product_category: "Tactical Flashlight",
        product_description: "Very long description text, don't ask why it is this long. I have no idea either ¯\_(ツ)_/¯",
        product_image: "/files/images/tactical_c8l.webp",
        product_led_chip: "XHP50.3",
        product_max_lumens: "3100",
        product_battery: "18650/21700",
        product_price: 29.99,
        product_link: "/product/tactical_c8l"
    }
];

// Route for the product page (dynamic URL)
router.get('/:id', function (req, res)
{
    const productId = req.params.id;  // Capture the product ID from the URL

    // Find the product from the array using the ID
    // const product = myarray.find(p => p.product_link === `/product/${productId}`);
    const product = myarray.find(p => p.product_link.endsWith(productId));
    console.log(`Url: ${product}`)

    if (!product)
    {
        return res.status(404).render("layout", { title: "Error: product not found", content: `<div class="flex items-center justify-center md:min-h-[360px] md:text-xl xl:text-3xl">Product not found</div>` });
    }

    // Render the individual product page
    res.render('products/product_detail', {
        product_name: product.product_name,
        product_category: product.product_category,
        product_price: product.product_price,
        product_image: product.product_image,
        product_led_chip: product.product_led_chip,
        product_max_lumens: product.product_max_lumens,
        product_battery: product.product_battery,
        layout: false
    }, function (err, html)
    {
        res.render('layout', {
            title: product.product_name,
            content: html,  // Inject the rendered HTML of products.hbs
            layout: false  // Don't use a layout for this specific response
        })
    });
});

// Export the router
module.exports = router;
