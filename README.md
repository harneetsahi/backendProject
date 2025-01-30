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
3. Postman

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

### Middlware using multer

32. We will inject multer wherever we need file upload capabilities.
33. To configure this middleware, create a multer file in the middlewares folder, and import multer.
34. Use the disk storage function to configure it. We specify destination and filename here, both of which define a function in their value.
35. This function will give us the localFilePath that we use in file handling for cloudinary.

---

### Router and Controller

1. Move into the controllers folder and create a file for user.controller.js
2. We will import the asyncHandler we created in utils to handle async functions.
3. create a method to registerUser. It uses asyncHandler as a wrapper for another async method. The inside async method sends an HTTP response back to the client with status code 200, and a json message 'ok', signaling that request was processed successfully.
4. In short, when the client hits this route, it sends a 200 ok response with the message 'ok'/

---

5. Now to create routes for users, we move into the routes folder and create a file.
6. import Router from express.
7. create a router object. We will use it to define routes on.
8. since we have separated routes and app file, we have to use a middleware to successully use the routes in the app.js file.
9. first import userRouter in app.js and configure the router by using app.use('/users', userRouter).
10. what this does is: whenever someone types /users, the control is automatically shifted to userRouter, which will go in user.routes.js file and find the route for the user.
11. now going back to user.routes.js, set a route on userRouter('/register').post(registerUser).
12. this method in turn moves the control to registerUser (we created that method in user.controller.js)

    > in short, when someone clicks on 'localhost:8000/users', userRouter will check the routes user can be directed to. One of those routes is 'register'. If a user clicks on 'localhost:8000/users/register', the control moves to user.controller.js, which has a method for registering a user.

13. now for standard practices, we will write 'api/v1/users' instead of 'users' in step 9.

14. you can check the api response in postman to confirm everything is correct or just check in your terminal by running npm run dev

---

### Logic Building

- get user details from frontend
- validate details to make it's not empty and is in correct format
- check if user already exists (via username or email)
- check for images and avatar
- upload them to cloudinary
- create user object to send to mongoDB
- create entry in DB. It sends us a response
- remove password and refresh token field from response
- check if user is successfully created
- return response or error if no creation

---

1. in user.controller.js registerUser method, grab user details from req.body and destructure to save in a variable.
2. you can test here in postman if everything is working as expected by console loggin email and going in postman > body > raw > json and write a key value for email. It should send a result in your node terminal in vscode.
3. for handling file uploads, we want to use the upload middleware we created. So first import it in user.routes.js, and then call it just before the method registerUser.
4. upload middleware gives you a few options (single for a single file, an array for multiple files in the same field). We will use '.field' option because we need multiple objects for different files.
5. '.field' accepts an array with multiple objects. We need two objects. One for avatar, and one for coverImage.

---

6. Now for validation, we move back to user.controller.js. and write a condition to check if all user details are filled.
7. If any of the fields are empty, use ApiError to throw an error. We created this class in utils.

---

8. Now to check if a user already exists, import User from user.models.js.
9. This User variable we created using mongoose can connect with database and has a method available findOne(username or email) that checks in the database if a user with that username or email exists.

---

10. Now we need to get local path of images. We use req.files method of multer to access the file path of the first uploaded file in the avatar field.
11. Next step is to upload on cloudinary.
12. We will use uploadOnCloudinary method we created in utils. Import here and upload avatar and coverImage.
13. Check if there is no avatar, then throw an error.

---

14. Next step is to create a user object and create entery in db
15. Now in our code, only User is talking to database so we will use it to create user object using '.create' on it with putting all user details in an object. Make sure to put await because connecting with database can take time.
16. To check if user was successfully created, we can use the method findById() and pass in user.\_id. At the same time, we can use select() to remove 'password' and 'refreshToken' from the object by using minus - sign before both properties.
17. Handle error if no user has been created.
18. finally return the response using ApiResponse.

---

19. Now is the time for testing again in postman to see if there are any errors. If everything is correct, unlink the file in cloudinary.js using fs.unlinkSync() to make sure file is removed synchronously from the file system.
20. While testing, when I did not upload coverImage, I was running into an error 'Cannot read properties of undefined (reading '0')'
21. This happens because of optional chaining where req.files?.coverImage[0]?.path is expecting a coverImage. If it's undefined that there is nothing for us to extract.
22. To resolve this, first I set coverImageLocalPath to empty. Then I created an if statement that checks if req.files exists and if it does, does it contain an array for coverImage and if it does, is its length more than 0. If yes, then it sets the coverImageLocalPath. Otherwise it will return an empty coverImage field.
23. If any other errors come up, first check if you are using 'await' for methods take can take time to produce an output.

---

### Configure Postman

1. In postman, we want to streamline testing. So copy your url we were testing on.
2. create a new collection, give it a proper name. 3. add a new request here, give it a name (eg. register) and enter your url. Make sure to select Post from the dropdown. By default it stays at Get. Save it.
3. I rearranged the folders by clicking on the register request I just created and clicking on save as > new folder 'users'. I moved the register request in users. And save. Delete the older register request if duplicated.
4. Now copy the front of your url 'http://localhost:8000/api/v1'. Click on environments, and create a new environment. I named it the same as my collection.
5. create a variable called server and enter the url we copied in initial value. Current value should be the same. Save it.
6. In top right, you have to option to choose an environment for this variable. Share it with your collection. It should now be available in your collection.
7. Go in register request and replace the front part of this url with {{server}}. It should now be {{server}}/users/register.
8. Now in the body > form-data > enter the key value pairs of user details. And save.
9. Now we have it saved here and we can use it test anytime. (make sure to save at every step)

---

### Access and Refresh Token

> **Access Token:** When you first log in, the server gives you an access token and a refresh token. You use the access token to authenticate API calls.
> **Refresh Token:** When the access token expires, you use the refresh token to obtain a new access token. This allows users to remain logged in without needing to manually reauthenticate.

### logic for login

- get data from req.body
- validate username / email field
- find user in db
- if not, throw error
- if found, check password
- if pass is wrong, throw error
- if pass is correct, generate access and refresh token
- send tokens to user by cookies

1. create loginUser method in user.controller.js using asyncHandler with an async function inside.
2. get data from req.body
3. if username or email is not entered, throw error
4. find user in database using findOne. Check for both email or username.
5. if user not found, throw error.
6. if found, check if password is correct by using isPasswordCorrect method we created earlier on userSchema. We have access to it through req.body. ** note: the methods given by mongoose are called on "User" with the U capital. The methods we created are used on the instance of User, which in this case is 'userExists'.**
7. if password is wrong, throw error.
8. If correct, generate access and refresh tokens.
9. we'll create a separate method all together for tokens.

---

10. create an async method generateAccessAndRefreshTokens that takes userId.
11. create a try catch block inside and throw error if any.
12. in try block, find user by id and store in a variable.
13. call generateRefreshToken and generateAccessToken methods on user and hold in a variable. We created these methods in userSchema so they should be available on User.
14. now since we store refresh token in database so we can give it to the user, we now have to store it in db.
15. in userSchema we have a property for refreshToken so using user.refreshToken = refreshToken, we can store this value.
16. now call user.save({validateBeforeSave: false}).
17. when you call mangoose's save method, it checks the data against any validation rules that are defined in the schema. So to disable that process, we can pass in {validateBeforeSave: false} inside save. It is done only when we know data is already validated. In our case, we have alreaedy validated the user email and password.
18. return both tokens
19. call generateAccessAndRefreshTokens method in loginUser method and pass in userExists.\_id (we get id from User) and put await before it and store it. Destructure both tokens.
20. Now we can either update our userExists so it has access to refreshToken or we can send another db request here to fetch information we need from it.
21. To send the db request, call findById on User using userExists.\_id and put a select method on it to remove password and refreshToken from the result and save it in a variable loggedInUser.
22. We now have all the fields except password and refreshToken and we are ready to send it to the user using cookies.

---

#### Send cookies

1. We have to design some options in order to send cookies. It is an object which has an option httpOnly and secure. Set them both to true so our cookies cannot be modified in frontend. It can only be modified on the server side now.
2. Now we have to return res.status(200) and attach cookie() to it. You can set as many cookies as you want and pass in the values you want to send. After cookies, attach a json method as well to send ApiResponse with status code, a message, and an object with loggedInUser and tokens.
3.

### Logout user

> logic: we should remove cookies, and reset tokens in order to log out the user.
> We need to first find the user. But how do we find user? We could try findById on User but we actually don't have any values to go off of. In the login method, we were able to use findById because we could ask the user their email and username and we used it to locate in our db. Now we can't ask at this stage. So we make use of a middleware.

1. create and export a method in user.controller.js to logout user using asyncHandler with async function inside. We will come back to it later.
2. earlier in app.js we configured cookieParser on app.use. This should allow us to use cookies on not just response but also on request.
3. create auth.middleware.js in middlewares folder.
4. create a method verifyJWT using asyncHandler with another asyn function inside. Since it's a middleware, we will need req, res, and next. Create a try catch block.
5. grab cookies from req and get accessToken (we added cookies in the login method). Make it optional chaining in case there are no cookies.
6. In mobile apps, we might not have cookies but there may be a custom header. So using logical OR operator, check if in req.header we have a key "Authorization" and if so, replace its 'Bearer ' (the word bearer and space after it) value with an empty string to get the token.
7. if no token found, throw error.
8. use jwt to verify the token.
9. use findById on User now and remove the values we do not want in the result.
10. Throw error if nothing was found.
11. assign req.user the new object we created 'user' and call next() at the end.

---

12. Go in the routes, import verifyJWT and create a new route for login. use post method with loginUser function.

13. create a new route for logout. use post method with logoutUser function.

14. to use the middlware, insert verifyJWT in the logout route as the first param in the post method (before logoutUser).

15. this will run the verifiyJWT before it logs out the user. this is also why we use 'next()' at the end of the middleware to signal the route to run the middlware and then move on to the next operation.

16. when this operation runs, it brings us back to user.controller.js to the logoutUser method. Now here we have access to req.user.

17. on User call a new method findByIdAndUpdate and pass in

    - the id from req.user.\_id
    - an object that has an operator of mongodb called $set to set refreshToken to undefined
    - another object that sets new: true. It returns a new updated value in response

18. create options again with httpOnly and secure set to true.

19. clear cookies from options and return the response with status code, clearCookies, and json response.

20. side note: in function when we pass in (req,res, next), if we do not use res, we can pass it in as \_ instead of res. (you'll find it in production grade code)

> we separated the verifyJWT functionality so we can reuse it in other functions like when a user posts something or when they like something, we would need to know if they are authenticated.
