const express = require('express');
const path = require('path');
const router = express.Router();
const root_dir = process.cwd();
const readfile = require(path.join(root_dir, './resources/js/readfile'));

/* GET home page. */
router.get('/', async function (req, res, next)
{
    res.render('index', { title: 'Homepage' });
});

module.exports = router;
