## VideoTube Backend Project

(using javascript)

### Libraries used:

1. nodemon
2. prettier
3. mongoose
4. express
5. dotenv
6. cors
7. cookie-parser
8. bcryptjs
9. jsonwebtoken
10. mongoose-aggregate-paginate-v2
11. multer
12. cloudinary

### External services used:

1. MongoDB
2. Cloudinary
3.

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

### Database Setup

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

### Application setup in app.js

1. import express. Call and store in a variable called app. And export it.
2. Going into index.js now, call a then and catch method on connectDB function.
3. In then method, call an 'on' and 'listen' method on app using process.env.port. This will start the server and application should start listening using the database we created.

---

#### Back to app.js

4. npm install and import cors and cookie-parser in app.js
5. Now to configure cors, call app.use with cors({}) inside. Refer to the documentation for more understanding.
6. you can allow origin inside the cors method. (save cors origin variable in env file and reference here) and credentials set to true.

---

7. Now to configure express, call app.use with express.json(). It parses incoming requests with json payload.
8. To accept incoming requests from url, we need app.use with express.urlencoded(). you can pass in an object with options like {extended: true, limit: '16kb'}. Depends on proejct needs.
9. To serve static assets from the public directory of your project. call app.use(express.static('public')).

---

10. for cookies, call app.use(cookieParser()).

---

### Utils

1. Since we will be using async function multiple times, it's better to create a utility for it so we can use it as a wrapper whenever we need it.
2. create asyncHandler.js file in utils that access a function and returns a function.
3. Pass in req,res,next as params in the function. Execute the function in the try block. In the catch block, get the error code and respond with a json error message.
4. This same code above can be written as a promise instead of using try catch. We will use this format for this project, but both are correct.

---

5. Now create apiHandler.js in utils and customize the nodejs Error class.
6. Now create apiResponse.js in utils and create a class.

---

### Handling models

1. create user.models.js and video.models.js
2. import mongoose and schema and create userSchema and videoSchema with all values laid out in eraser file. For images, we will use cloudinary.
3. install mongoose-aggregate-paginate-v2 for aggregation queries and import it in the video model file.
4. refer to mongoose documentation for information on middleware. There are plugins you can create.
5. We will use a plugin on videoSchema.

---

6. install bcryptjs to hash passwords.
7. install jsonwebtoken for authentication.
8. import jwt and bcrypt in user model file.

---

9. now we need hooks from mongoose (middleware) to make use of encryption.
10. use pre() method with 'save' on userSchema that basically runs encryption just before data is saved. This method also gets a call back function but don't use arrow function because we need access to 'this' reference.
11. This process can take time so we will use async. We also make use of 'next' here and pass it on after.
12. Use bcrypt.hash method to encrypt password.
13. Now since it's set on pre() method, it will keep running it every time user saves something even if they just changed their image. So we will need to tell it to only run it when password is being modified.
14. So we use a condition isModified('password') to check if password is modified. If not, return next() immediately.

---

15. Now when user logs in, we need to make sure they are entering the correct password. To verify that, we will create a method using mongoose that lets us compare the password user enters with the encrypted password we saved earlier.

16. I created a method 'isPasswordCorrect' on userSchema, which is an async function. It takes password as a param. It is plaintext password user enters when trying to log in. Then I used bcrypt.compare method, which takes password, and this.password (encrypted password).

---

17. Moving to jwt, using SHA256 key or any other key generate a unique key.
18. create an env variable access_token_secret and save the key in the variable. Create another variable refresh_token_secret and save another key.
19. Create another env variable for access_token_expiry with 1d or 2d (days).
20. Another variable refresh_token_expiry = 10d. Refresh token expiry is usually longer than access token.
21. Access token will not be saved in database for security. We will only save refresh token in db.

---

22. on userSchema, we will create two new mothods to generate access token, and to generate refresh token.

23. inside generateAccessToken method, we will call sign method on jwt that takes {payload (id, email, username, fullname)}, process.env.ACCESS_TOKEN_SECRET, {expiry}.

24. same code is called inside generateRefreshToken except that it needs just an id as payload and replace access token with refresh token.

---

### File handling

25. npm i cloudinary, npm i multer
26. We will use multer to take the file from the user and temporarily store it on our local server. Afterwards, we will use cloudinary to grab the file from local storage and host on their server.
27. create a new file in utils for cloudinary.
28. Refer to documentation on your cloudinary account for code.
29. We will make use of file system of nodejs to get file path. So import fs from 'fs'.
30. Configure cloudinary amd store secret variables in your env file.
31. create an uploader function and wrap it in try catch block for error handling. If error occurs, we want to remove the file from local storage so make use of fs.unlinkSync.

---
