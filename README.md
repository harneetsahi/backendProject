## VideoTube Backend Project

(using javascript)

### Basic structure of your files

1. npm init. git init.
2. public folder with temp folder inside, that has .gitkeep inside to track it.
3. src folder with app.js, constants.js, index.js.
4. .env file in root.
5. .gitignore in root with generated code online and add .env to it.
6. add type=module to package.json for 'import functionality'.
7. npm install nodemon as dev dependency. It restarts the server whenever your file is saved.
8. add "dev": "nodemon src/index.js" to script in json file. It will run nodemon when you run 'npm run dev'.
9. create some directories/folders in src folder: controllers, db, middlewares, models, routes, utils.
10. ideally you should also npm i -D prettier so the entire team is on the same formatting standards.
11. for prettier, you also have to create .prettierrc in your root. Add some code to it:

```
{
  "singleQuotes": false,
  "bracketSpacing": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "semi": true
}
```

12. create .prettierignore and add files you do not want to be touched by prettier.

```
  /.vscode
  /node_modules
  ./dist

  *.env
  .env
  .env.*
```

---

### MongoDB Connection

1. Create a project in mongoDB Atlas.
2. Use aws provider. Set up username, password, and connect from local environment.
3. Set an IP address that can access it.
4. Set up a connection using compass and use the connection url.
5. If any steps are missed, go in Database access and Network access in Security in the sidebar and set your IP address. Production grade code should NOT select 'allow access from anywhere' when setting IP list entry.
6. In database access, you can add a new user if needed and set your built-in role to read and write any database.
7. Set the connection url fetched in step 4 as MONGODB_URI in your .env file. (if missed, you can grab it by going in your cluster > connect > compass).
8. When setting it as MONGODB_URI, make sure to remove the last slash from the url.
9. Now go in your constants.js file and create and export a variable that has your database name.

```
DB_NAME = 'projectname'
```

### Back to project

> **Important**: always use try catch to code database because there can be unexpected errors and we need to catch them. And use async await promises. It takes time to connect with database, no matter how fast, so always make sure to wrap your code in try catch and use promises.

1. npm i mongoose express dotenv
2. import mongoose from 'mongoose' in your index.js.
3. Now one approach is to fire an IIFE that has an async callback function. Set try catch and call mongoose.connect. Pass in process.env.MONGODB_URI (we set earlier in env) and DB_NAME.
4. import express. call express and store in a variable in the same index.js file and then set a call 'on' and 'listen' method on express to catch any errors and listen to the port inside IIFE. But this approach pollutes the index file. This method is written in index.js for reference but commented out.

5. Replacing step 3 and 4, we will use the second approach in this project, whereby we create a separate file in the databse folder where we write the code for database and import it in index.js to just execute it.

6. Create index.js in db folder. Import mongoose and DB_NAME.

7. Create an async function with try catch. Call mongoose.connect using MONGODB_URI and DB_NAME and store in a variable. I used process.exit(1) method to handle the error.

8. Import the function in index.js in the src folder. And import "dotenv/config" at the top to make env variables available. And call the db function.

9. Run the script here to see the result. If errors come up, pay attention to the error message to resolve.
