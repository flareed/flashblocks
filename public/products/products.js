const express = require("express");
const path = require("path");
const router = express.Router();
const hbs = require("hbs")

partial_path = path.join(__dirname, "partial");
hbs.registerPartials(partial_path);

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

/* GET home page. */;
router.get('/', function (req, res, next)
{
    res.render('products/products', {
        product_list: myarray,
        layout: false
    }, function (err, html)
    {
        res.render('layout', {
            title: 'Products',
            content: html,  // Inject the rendered HTML of products.hbs
            layout: false  // Don't use a layout for this specific response
        })
    })
});

module.exports = router;
