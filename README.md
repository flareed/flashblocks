# I INFO
Nodejs 20 LTS
\
Nodejs framework: expressjs 4
\
Node modules: express-session, passport, bcrypt, hbs (handlebars),... (all can be viewed from package.json)
\
\
Posgresql 15 (running on debian 12 arm64)
\
Tailwind CSS 3.4.15

# II RUNNING
## 1. Download and navigate to folder with app.js
Either download everything through github or use git clone
\
Extract the .zip if you download everything then go go where the app.js is and open the terminal

## 2. Installing nodejs dependency ↓↓↓
```npm install```
\
This command will also install dev dependencies

## 2.5. Making posgresql database & tables ↓↓↓
~~Use the provided SQL file(s) to make your database for the site~~

## 3. Production ↓↓↓
```npm start```
\
Use this if you only want to run the site
## 3. Development ↓↓↓
```npm run dev```
\
In case you want to run with nodemon for development (nodemon will reload nodejs whenever there a change to .js .html .hbs, can be configured)
# III CONFIG
Change the content of ".env" file to your address
\
Example: you want to host on port 3500, make it like this: PORT=3500

# SOURCE
[tailblocks.cc](https://tailblocks.cc) for references
\
[flowbite.com](https://flowbite.com/docs/forms/search-input/)
\
ChatGPT
\
[swiminguy](https://www.deviantart.com/swiminguy/art/flashlight-in-the-dark-888954) for the main background image
\
[sofirnlight](https://www.sofirnlight.com) for the product info to create the site