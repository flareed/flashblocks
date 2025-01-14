const path = require('path');
const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing'));

const args = process.argv.slice(2); // skip the first 2 (they are not the arguments from user)

(async () => 
{
    if (args.length === 0)
    {
        // console.log("No arguments provided!");
        console.log("Error, no argument provided");
        return;
    }

    console.log(`Hashed password for "${args[0]}" is:`)
    console.log(await hasher.hash(args[0]));
})();
