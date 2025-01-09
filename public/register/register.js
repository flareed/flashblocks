const express = require('express');
const path = require('path');
const router = express.Router();

const root_dir = process.cwd();
const readfile = require(path.join(root_dir, './resources/js/readfile.js'));
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));

async function processRegister(req)
{
    const { username, email, password, password_confirm } = req.body;
    // console.log("Body: ");
    // console.log(req.body);
    // console.log("Body end");

    let message = "";

    // Basic validation
    if (!username || !email || !password || !password_confirm || username.trim() == "" || password.trim() == "" || email.trim() == "" || password_confirm.trim() == "")
    {
        message = "All fields are required.";
    }
    else if (password !== password_confirm)
    {
        message = "Passwords do not match.";
    }
    else if (await database.isUsernameExist(username))
    {
        message = "Username already existed.";
    }
    else if (await database.isEmailExist(email))
    {
        message = "Email already existed.";
    }
    else
    {
        try
        {
            const lowercase_email = email.toLowerCase();
            const hashed_password = await hasher.hash(password);

            const is_success = await database.insertUser(username, lowercase_email, hashed_password);
            if (is_success)
            {
                message = "Registration successful!";
            }
            else
            {
                message = "An error occurred during registration.";
            }
        }
        catch (error)
        {
            console.error("Error during registration:", error);
            message = "An error occurred during registration.";
        }
    }

    return message;
}

/* GET home page. */
router.get('/', async function (req, res, next)
{
    let message = "";
    // console.log(await hasher.hash("test"));

    res.render('register/register.hbs', { title: 'Register', isRegisterPage: true })
});

router.post('/', async function (req, res, next)
{
    const message = await processRegister(req);

    // Respond with JSON
    res.status(201).json({ message: message });
});

module.exports = router;
