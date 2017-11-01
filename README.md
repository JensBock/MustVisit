"# MustVisit" 


# Start dev app
install mongodb
* npm install -g @angular/cli (https://cli.angular.io/)
* npm install -g nodemon (https://nodemon.io/)
cd MustVisit npm install
cd MustVisit\client npm install
cmd mongod
cd MustVisit nodemon index.js
cd MustVisit\client ng serve



# Build order

>The development server
Step 1 For building the server
* npm install express --save (https://expressjs.com/)

Step 2 For restarting the development server
* npm install -g nodemon (https://nodemon.io/)
go to folder MustVisit cmd => nodemon index.js

Step 3 For handling the mongodb
* npm install mongoose --save (http://mongoosejs.com/)

Step 4 Translate requests from the frontend
* npm install body-parser --save (https://www.npmjs.com/package/body-parser)

Step 5 encrypt passwords
* npm install bcrypt-nodejs --save (https://www.npmjs.com/package/bcrypt-nodejs)

Step 6 cross origin (only nescessary for dev)
* npm install cors --save (https://www.npmjs.com/package/cors)

Step 7 create token
* npm install jsonwebtoken --save (https://www.npmjs.com/package/jsonwebtoken)


>The development db
Step 1 For starting the db
cmd mongod (https://www.mongodb.com/)
use robomong as UI (https://robomongo.org/)


>The frontend
Step 1 angular/cli live development server
* npm install -g @angular/cli (https://cli.angular.io/)
ng new PROJECT-NAME
cd PROJECT-NAME
ng serve

Step 2 display messages on the fly that are not static to the page
* npm install angular2-flash-messages --save (https://www.npmjs.com/package/angular2-flash-messages)

Step 3 check if a token is not expired
* npm install angular2-jwt --save (https://github.com/auth0/angular2-jwt)
