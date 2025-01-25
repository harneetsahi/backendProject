## Backend Project

with javascript

1. npm init. git init.
2. Public folder with temp folder inside, that has .gitkeep inside to track it.
3. Src folder with app.js, constants.js, index.js.
4. .env file in root.
5. .gitignore in root with .env inside it
6. add type=module to package.json for import functionality.
7. npm install nodemon as dev dependency. It restarts the server whenever your file is saved.
8. add "dev": "nodemon src/index.js" to script in json file. It will run nodemon when you run 'npm run dev'
