var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var utils = require('utils');
var mysql = require('mysql');
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
var app = express();
app.set('port', process.env.PORT || 8000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	response.writeHead(200, "OK", {'Content-Type': 'text/html'});
	response.write('<html><head><title>Hello Noder!</title></head><body>');
	response.write('<h1>Welcome Noder, who are you?</h1>');
	response.write('<form enctype="application/x-www-form-urlencoded" action="/formhandler" method="post">');
	response.write('Name: <input type="text" name="username" value="John Doe" /><br />');
	response.write('Age: <input type="text" name="userage" value="99" /><br />');
	response.write('<input type="submit" />');
	response.write('</form></body></html');
	response.end();
});
app.post("/formhandler", function (request, response) {
	console.log("[200] " + request.method + " to " + request.url);
	var fullBody = '';
	request.on('data', function(chunk) {
		console.log("Received body data:");
		console.log(chunk.toString());
		fullBody += chunk.toString();
		response.end();
	});
	request.on('end', function() {
		response.writeHead(200, "OK", {'Content-Type': 'text/html'});
		var decodedBody = querystring.parse(fullBody);
		response.write('<html><head><title>Post data</title></head><body><pre>');
		response.write(utils.inspect(decodedBody));
		response.write('</pre></body></html>');
		response.end();
	});
	response.write('<html><head><title>Post data</title></head><body><pre>');
	response.end();
});
http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});
