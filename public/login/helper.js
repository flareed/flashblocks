const path = require('path');

const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing.js'));
const database = require(path.join(root_dir, './resources/js/database.js'));

async function processLogin(req)
{
    const { username, password } = req.body;
    const hashed = await hasher.hash(password);
    // console.log("Body: ");
    // console.log(req.body);
    // console.log("Body end");

    let message = "";

    // Basic validation
    if (!username || !password || username.trim() == "" || password.trim() == "")
    {
        message = "All fields are required.";
        return message;
    }

    const isUsernameExist = await database.isUsernameExist(username);
    if (!isUsernameExist)
    {
        message = "Username or password not existed."; // for security, incase of brute force, the attacker won't know if this acc exists or not
        return message;
    }

    const isPasswordMatch = await hasher.compare(password, await database.getPasswordFromUsername(username));
    if (!isPasswordMatch)
    {
        message = "Username or password not existed."; // for security, incase of brute force, the attacker won't know if this acc exists or not
    }
    else
    {
        message = "Correct, redirecting soon";
    }


    return message;
}

async function processForgetPassword(req)
{
    const { email } = req.body;
    const lowercase_email = email.toLowerCase();
    let message = "";

    const isEmailExist = await database.isEmailExist(lowercase_email)
    if (isEmailExist)
    {
        message = "We will do something";
    }
    else
    {
        message = "Wrong email, please reenter";
    }

    return message;
}

module.exports =
{
    processLogin, processForgetPassword
}