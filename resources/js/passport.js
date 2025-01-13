const path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local');

const root_dir = process.cwd();
const hasher = require(path.join(root_dir, './resources/js/password_hashing'));
const database = require(path.join(root_dir, './resources/js/database'));

passport.use(new LocalStrategy({ usernameField: "username", passwordField: 'password' },
    async (username, password, callback) =>
    {
        // callback(error, user, message)
        try
        {
            if (!username || !password || username.trim() === "" || password.trim() === "") 
            {
                return callback(null, false, { message: "All fields are required." });
            }

            const isUsernameExist = await database.isUsernameExist(username);
            if (!isUsernameExist)
            {
                // for security, incase of brute force, the attacker won't know if this acc exists or not
                return callback(null, false, { message: "Username or password not existed." });
            }

            const hashedPassword = await database.getPasswordFromUsername(username);
            const isPasswordMatch = await hasher.compare(password, hashedPassword);
            if (!isPasswordMatch)
            {
                return callback(null, false, { message: "Username or password is incorrect." });
            }

            const user = { username }; // Include more user details if necessary
            return callback(null, user);
        }
        catch (error)
        {
            return callback(error);
        }
    }));

passport.serializeUser((user, callback) => 
{
    // console.log("Serializing user");
    callback(null, user.username);
});

passport.deserializeUser(async (username, callback) =>
{
    try
    {
        const user = await database.getUserFromUsername(username); // Fetch full user details
        // console.log("Deserialized user object:");
        // console.log(user);

        if (Object.keys(user).length < 1)
        {
            return callback(new Error("User not found or invalid user data"), null);
        }

        // passing everything (except password) into userWithoutPassword
        // "user" is still the same, no field removed
        const { password, address, creditcard, ...userWithoutPassword } = user;

        callback(null, userWithoutPassword);
    }
    catch (error)
    {
        callback(error);
    }
});

module.exports = passport;