const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const locations = require('./routes/locations')(router);
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

mongoose.Promise = global.Promise;
mongoose.connect(config.uri,{useMongoClient: true}, (err) => {
	if(err) {
		console.log('Could not connect to database: ', err);
	} else {
//		console.log(config.secret);
		console.log('Connected to database: ' + config.db);
	}
});

//Middleware
app.use(cors({ origin: 'http://localhost:4200' })); // Allows cross origin in development only
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());// parse application/json
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/locations', locations);

//app.get('/', function(req,res){
//	res.send('hello world');
//});

app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
})