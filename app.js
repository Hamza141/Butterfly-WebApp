var express = require("express"),
    app = express(),
	port = process.env.VCAP_APP_PORT || 8080;
app.get("/", function (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.end("Index\n");
});
app.get("/hello", function (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.end("Hello World!\n");
});
app.listen(port);
