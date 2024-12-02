const fs = require('fs').promises;

async function write(filepath, content)
{
    try
    {
        data = await fs.writeFile(filepath, content);
    }
    catch (err) 
    {
        console.error('Error writing files:', err);
        throw err; // Rethrow the error so it can be caught in the route handler
    }
}

module.exports =
{
    write
};