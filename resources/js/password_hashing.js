const bcrypt = require('bcrypt');

async function hash(str, rounds = 10)
{
    let hashed = "";

    try
    {
        hashed = await bcrypt.hash(str, rounds);

        /* Uncomment this if validation is needed */
        // const is_matched = await bcrypt.compare(str, hashed);
        // if (!is_matched)
        // {
        //     throw new Error("Hashed password does not match the original");
        // }
        // console.log("Password matched original");
    }
    catch (error)
    {
        console.error("Error handling password:", error);
        throw error; // Rethrow to notify the calling function of the failure
    }

    return hashed;
}

async function compare(str, hashed)
{
    let result = false;

    try
    {
        result = await bcrypt.compare(str, hashed);
    }
    catch (error)
    {
        console.error("Error when comparing password:", error);
        throw error; // Rethrow to notify the calling function of the failure
    }

    return result;
}

module.exports =
{
    hash, compare
};