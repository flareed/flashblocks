const express = require('express');
const path = require('path');
const router = express.Router();
const root_dir = process.cwd();
const readfile = require(path.join(root_dir, './resources/js/readfile'));

/* GET home page. */
router.get('/', async function (req, res, next)
{
    // try
    // {
    //     const data = await readfile.getHTMLContent(path.join(__dirname, "index.html"))
    // }
    // catch (err)
    // {
    //     res.status(500).send('Error rendering page');
    // }
    res.render('index', { title: 'Homepage' });
});

module.exports = router;
