var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var utils = require('utils');
var mysql = require('mysql');
var app = express();
var db_config = {
	host     : 'localhost',
	user     : 'root',
	password : 'Ghost999',
	database : 'Butterfly-Web'
};
/*var db_config = {
	host     : 'us-cdbr-iron-east-04.cleardb.net',
	user     : 'b3bd94cf7c5125',
	password : 'b256d9ed',
	database : 'ad_9ddc31f035745cd'
};*/
var connection;
function handleDisconnect() {
  	connection = mysql.createConnection(db_config);
  	connection.connect(function(err) {
    	if(err) {
    		console.log('error when connecting to db:', err);
      		setTimeout(handleDisconnect, 2000);
    	}
  	});
    connection.on('error', function(err) {
	    console.log('db error', err);
	    if(err.code == 'PROTOCOL_CONNECTION_LOST') {
	      	handleDisconnect();
	    } else {
	      	throw err;
	    }
  	});
}
handleDisconnect();
app.set('port', process.env.PORT || 8000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	response.writeHead(200, "OK", {'Content-Type': 'text/html'});
	response.write('<html><head><title>Chat Box</title></head><body>');
	response.write('<h1>Login</h1>');
	response.write('<form enctype="application/x-www-form-urlencoded" action="/room" method="post">');
	response.write('Username: <input type="text" name="username" value="" /><br />');
	response.write('Password: <input type="text" name="password" value="" /><br />');
	response.write('<input type="submit" /><br />');
	response.write('<A HREF="register"> Register</A>');
	response.write('</form></body></html');
	response.end();
});
app.get("/register", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	response.write('<html><head><title>Registration</title></head><body>');
	response.write('<h1>New Account Registration</h1>');
	response.write('<form enctype="application/x-www-form-urlencoded" action="/user" method="post">');
	response.write('Username: <input type="text" name="username" value="" /><br />');
	response.write('Password: <input type="text" name="password" value="" /><br />');
	response.write('<input type="submit" /><br />');
	response.write('<A HREF="/"> Login</A>');
	response.write('</form></body></html');
	response.end();
});
app.post("/user", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	var username = request.body.username;
	var password = request.body.password;
	connection.connect(function(err) {
  		var post  = {userName: username};
  		var query = connection.query('SELECT * FROM Users WHERE ?', post, function(err, result) {});
   		console.log(query.sql);
 	});
	connection.connect(function(err) {
  		var post  = {userName: username, userPassword: password};
  		var query = connection.query('INSERT INTO Users SET ?', post, function(err, result) {});
   		console.log(query.sql);
 	});
});
app.post("/room", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	var username = request.body.username;
	var message = request.body.message;
	connection.connect(function(err) {
  		var post  = {username: username, message: message};
  		var query = connection.query('INSERT INTO Messages SET ?', post, function(err, result) {});
   		console.log(query.sql);
 	});
	response.writeHead(200, "OK", {'Content-Type': 'text/html'});
	response.write('<html><head><title>Chat Box</title></head><body>');
	connection.connect(function(err) {
  		var query = connection.query('SELECT * FROM Messages', function(err, result) {
			var length = 0;
			for (var h = 0; h < result.length; h++) {
				if (result[h].username.length > length) {
					length = result[h].username.length;
				}
			}
			response.write('<style>div {border: 1px solid black; background-color: lightblue;}</style>');
			response.write('<div id="chat" style="overflow-y: scroll; height:90%;"><div>');
			for (var i = 0; i < result.length; i++) {
				var reLength = result[i].username.length;
				response.write(result[i].username + ": " + result[i].message);
				response.write("<br/>");
			};
			response.write('</div></body>');
			response.end();
		});
		response.write('<form enctype="application/x-www-form-urlencoded" action="/room" method="post">');
		response.write('Name: <input type="text" name="username" value="" /><br />');
		response.write('Message: <input type="text" name="message" value="" style="width:100%;" /><br />');
		response.write('<input type="submit" /></html>');
 	});
});
http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});
