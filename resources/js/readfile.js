const fs = require('fs').promises;

async function getFileContent(filepath, format = "utf8")
{
    let data = ""

    try
    {
        data = await fs.readFile(filepath, format);
    }
    catch (err) 
    {
        console.error('Error reading files:', err);
        throw err; // Rethrow the error so it can be caught in the route handler
    }

    return data
}

module.exports = {
    getFileContent
};