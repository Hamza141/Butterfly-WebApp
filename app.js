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
	    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
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
	response.write('<h1>Name and Message</h1>');
	response.write('<form enctype="application/x-www-form-urlencoded" action="/formhandler" method="post">');
	response.write('Name: <input type="text" name="username" value="" /><br />');
	response.write('Message: <input type="text" name="message" value="" /><br />');
	response.write('<input type="submit" />');
	response.write('</form></body></html');
	response.end();
});
app.post("/formhandler", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	var username = request.body.username;
	var message = request.body.message;
	connection.connect(function(err) {
  		console.log('connected to local');
  		var post  = {username: username, message: message};
  		var query = connection.query('INSERT INTO Messages SET ?', post, function(err, result) {});
   		console.log(query.sql);
 	});
	response.writeHead(200, "OK", {'Content-Type': 'text/html'});
	response.write('<html><head><title>Chat Box</title></head><body>');
	response.write('<h1>Name and Message</h1>');
	response.write('<p>message</p>');
	connection.connect(function(err) {
  		console.log('connected to local');
  		var query = connection.query('SELECT * FROM Messages', function(err, result) {
			//console.log(result);
			for (var i = 0; i < result.length; i++) {
  				//console.log(result[i].message);
				response.write(result[i].message);
				response.write('<br/>');
			};
			response.write('</body></html');
			response.end();
		});
   		console.log(query.sql);
 	});

});
http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});
