var express = require("express"),
    app = express(),
	port = process.env.VCAP_APP_PORT || 8080;
var mysql = require('mysql');
/*var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Ghost999',
	database : 'Butterfly'
});*/
var connection = mysql.createConnection({
	host     : 'us-cdbr-iron-east-04.cleardb.net',
	user     : 'b3bd94cf7c5125',
	password : 'b256d9ed',
	database : 'ad_9ddc31f035745cd'
});
connection.connect(function(err) {
  console.log('connected to local');
  var post  = {firstName: 'He', googleID: 'asdf@google.com'};
  var query = connection.query('INSERT INTO Users SET ?', post, function(err, result) {
    // Neat!
  });
  console.log(query.sql);
});

app.get("/", function (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.end("Index\n");
});
app.get("/hello", function (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.end("Hello World!\n");
});
app.put("/addUser", function (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.end("Done\n");
});
app.listen(port);
