const express = require('express');
const path = require('path');
const router = express.Router();

const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));
const helper = require(path.join(__dirname, "helper.js"));


/* GET home page. */
router.get('/', async function (req, res, next)
{
    let message = "";
    // console.log(await hasher.hash("test"));

    res.render('register/register.hbs', { title: 'Register', isRegisterPage: true })
});

router.post('/', async function (req, res, next)
{
    const message = await helper.processRegister(req);

    // Respond with JSON
    res.status(201).json({ message: message });
});

module.exports = router;
