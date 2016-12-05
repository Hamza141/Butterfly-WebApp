var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var utils = require('utils');
var mysql = require('mysql');
var path = require('path');
var router = express.Router();
var app = express();
/*var db_config = {
	host     : 'localhost',
	user     : 'root',
	password : 'Ghost999',
	database : 'Butterfly'
};*/
var db_config = {
	host     : 'us-cdbr-iron-east-04.cleardb.net',
	user     : 'b3bd94cf7c5125',
	password : 'b256d9ed',
	database : 'ad_9ddc31f035745cd'
};
var connection = mysql.createConnection(db_config);
/*function handleDisconnect() {
  	connection = mysql.createConnection(db_config);
  	connection.connect(function(err) {
    	if(err) {
    		console.log('error when connecting to db:', err);
      		setTimeout(handleDisconnect, 2000);
    	}
  	});
    connection.on('error', function(err) {
	    console.log('db error', err);
	    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
	      	handleDisconnect();
	    } else {
	      	throw err;
	    }
  	});
}
handleDisconnect();*/
var user;
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	response.render('loginPage', {
    	title: 'Login'
  	});
});
app.get("/register", function (request, response) {
	//console.log("[200] " + request.method + " to " + request.url);
	response.render('register', {
    	title: 'register'
  	});
});
app.post("/validateLogin", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	var googleID = request.body.googleID;
	var password = request.body.userPassword;
	console.log(googleID + " " + password);
	connection.connect(function(err) {
  		var post  = {googleID: googleID};
  		var query = connection.query('SELECT * FROM WebUsers WHERE ?', post, function(err, result) {
			if (googleID === result[0].googleID && password === result[0].userPassword) {
				console.log('redirect');
				user = googleID;
				response.redirect('/listCommunities');
			}
		});
		//console.log(query.sql);
 	});
});
app.post("/registerUser", function (request, response) {
	//console.log("[200] " + request.method + " to " + request.url);
	var firstName = request.body.firstName;
	var lastName = request.body.lastName;
	var googleID = request.body.googleID;
	var password = request.body.userPassword;
	connection.connect(function(err) {
  		var post  = {userName: username};
  		var query = connection.query('SELECT * FROM WebUsers WHERE ?', post, function(err, result) {
			//console.log(result);
			if (result == "") {
				connection.connect(function(err) {
					var post  = {firstName: firstName, lastName: lastName, googleID: googleID, userPassword: password};
					var query = connection.query('INSERT INTO WebUsers SET ?', post, function(err, result) {});
					//console.log(query.sql);
				});
			} else {
				response.render('loginPage', {
			    	title: 'Home'
			  	});
			}
		});
   		//console.log(query.sql);
 	});
	response.redirect('/room');
});
app.get("/listCommunities", function (request, response) {
	//console.log("[200] " + request.method + " to " + request.url);
	var query = connection.query('SELECT * FROM Communities', function(err, result) {
		//connection.end();
		if (err) throw err;
		else {
            var communities = result;
            response.render('communities', {
                title: 'Communities List',
                communities : communities});
        }
	});
});
app.get("/createCommunity", function (request, response) {
	//console.log("[200] " + request.method + " to " + request.url);
	response.render('createCommunity', {
    	title: 'Create Community'
  	});
});
app.post("/validateCommunity", function (request, response) {
	//console.log("[200] " + request.method + " to " + request.url);
	var category = request.body.category;
	var subcategory = request.body.subcategory;
	var description = request.body.description;
	var communityName = request.body.communityName;
	var post = {category: category, subcategory: subcategory, description: description, name: communityName};
	connection.connect(function(err) {
  		var query = connection.query('INSERT INTO communities SET ?', post, function(err, result) {});
	});
	connection.connect(function(err) {
		var tableDef = 'CREATE TABLE ' + communityName.replace(/ /g, "_") + '_Board (idMessage INT(4) AUTO_INCREMENT NOT NULL PRIMARY KEY, pinned INT(4), name VARCHAR(255), date DATE, message TEXT CHARACTER SET latin1 COLLATE latin1_general_cs)'
  		var query = connection.query(tableDef, function(err, result) {});
	});
	console.log(communityName);
	response.redirect('/room/' + communityName);
});
app.get("/room/:community", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	response.writeHead(200, "OK", {'Content-Type': 'text/html'});
	response.write('<html><head><title>Chat Box</title></head><body>');
	connection.connect(function(err) {
		var communityName = request.params.community.replace(/ /g, "_");
		var room = "/room/";
		room += communityName;
		communityName += "_Board";
  		var query = connection.query('SELECT * FROM ' + communityName, function(err, result) {
			if (err) throw err;
			else {
				response.write('<style>div {border: 1px solid black; background-color: lightblue;}</style>');
				response.write('<div id="chat" style="overflow-y: scroll; height:90%;"><div>');
				for (var i = 0; i < result.length; i++) {
					response.write(result[i].name + ": " + result[i].message);
					response.write("<br/>");
				};
				response.write('</div></body>');
				response.end();
			}
		});
		console.log("room is " + room);
		response.write('<form enctype="application/x-www-form-urlencoded" action="'+room+'" method="post">');
		response.write('Message: <input type="text" name="message" value="" style="width:100%;" /><br />');
		response.write('<input type="submit" /></html>');
 	});
});
app.post("/room/:community", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	var communityName = request.params.community.replace(/ /g, "_");
	var room = "/room/";
	room += communityName;
	communityName += "_Board";
	var message = request.body.message;
	connection.connect(function(err) {
  		var post  = {name: user, message: message};
  		var query = connection.query('INSERT INTO ' + communityName + ' SET ?', post, function(err, result) {});
   		console.log(query.sql);
 	});
	response.writeHead(200, "OK", {'Content-Type': 'text/html'});
	response.write('<html><head><title>Chat Box</title></head><body>');
	connection.connect(function(err) {
  		var query = connection.query('SELECT * FROM ' + communityName, function(err, result) {
			response.write('<style>div {border: 1px solid black; background-color: lightblue;}</style>');
			response.write('<div id="chat" style="overflow-y: scroll; height:90%;"><div>');
			for (var i = 0; i < result.length; i++) {
				response.write(result[i].name + ": " + result[i].message);
				response.write("<br/>");
			};
			response.write('</div></body>');
			response.end();
		});
		console.log(query.sql);
		console.log("post room is " + room);
		response.write('<form enctype="application/x-www-form-urlencoded" action='+room+' method="post">');
		response.write('Message: <input type="text" name="message" value="" style="width:100%;" /><br />');
		response.write('<input type="submit" /></html>');
 	});
});
http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	//console.log('Express server listening on port ' + app.get('port'));
});
