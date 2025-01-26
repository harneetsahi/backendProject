## Backend Project

with javascript

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
