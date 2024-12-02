const fs = require('fs').promises;

async function getHTMLContent(filepath)
{
  let data = ""

  try
  {
    data = await fs.readFile(filepath, 'utf8');
  }
  catch (err) 
  {
    console.error('Error reading files:', err);
    throw err; // Rethrow the error so it can be caught in the route handler
  }

  return data
}

module.exports = { 
  getHTMLContent 
};