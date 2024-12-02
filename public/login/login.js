const express = require('express');
const path = require('path');
const router = express.Router();
const root_dir = process.cwd();
const readfile = require(path.join(root_dir, './resources/js/readfile'));

/* GET home page. */
router.get('/', async function (req, res, next)
{
    // /login?view=forgot_password
    const query = req.query.view;
    console.log(req.url);
    console.log(query);

    let title = "";
    let filepath = "../error.hbs";
    let data = `<div class="flex items-center justify-center md:min-h-[360px] md:text-xl xl:text-3xl">2FA</div>` // error by default

    // login page
    if (req.url === "/")
    {
        title = "Login";
        filepath = "login.html";
    }

    // /login?view=forget
    if (query && query === "forget")
    {
        title = "Forgot password";
        filepath = "forgot_password/forgot_password.html";
    }
    
    // /login?view=2fa
    if (query && query === "2fa")
    {
        title = "2FA";
        filepath = "2fa/2fa.html";
    }

    console.log(filepath);
    try
    {
        data = await readfile.getHTMLContent(path.join(__dirname, filepath))
    }
    catch (err)
    {
        res.status(500).send('Error rendering page');
    }

    res.render('layout', { title: title, content: data });
});

module.exports = router;
