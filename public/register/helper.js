const path = require('path');

const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));

async function processRegister(req)
{
    const { username, email, password, password_confirm } = req.body;

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
    else if (password.length < 6)
    {
        message = "Password is too short (min 6 chars)"
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

module.exports =
{
    processRegister,
}