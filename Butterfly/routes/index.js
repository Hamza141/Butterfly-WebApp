var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var user;
var db_config = {
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b3bd94cf7c5125',
    password : 'b256d9ed',
    database : 'ad_9ddc31f035745cd'
};

var connection = mysql.createConnection(db_config);

/* GET home page. */
router.get('/', function (req, res, next) {
    //console.log("testing\n");
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/data', function (req, res) {
    res.json([{"id": 1, "name": "Mymm", "message": "Pantano do Sul"},
        {"id": 2, "name": "Skyble", "message": "Guilmaro"},
        {"id": 3, "name": "Tagfeed", "message": "Gnosjö"},
        {"id": 4, "name": "Realcube", "message": "Jrashen"},
        {"id": 5, "name": "Bluejam", "message": "Zhangjiawo"},
        {"id": 6, "name": "Jayo", "message": "Obonoma"},
        {"id": 7, "name": "Cogidoo", "message": "Sungsang"},
        {"id": 8, "name": "Avavee", "message": "Diawara"},
        {"id": 9, "name": "Tagtune", "message": "Monywa"},
        {"id": 10, "name": "Centimia", "message": "Retkovci"}]);
});

router.get('/validateLogin', function (req, res) {
    var urlPieces = req.url.split("googleID=");
    var importantPieces = urlPieces[1].split("&password=");
    var googleID = importantPieces[0];
    var password = importantPieces[1];
    //console.log(googleID);
    //console.log(password);
    connection.connect(function() {
        var post  = {googleID: googleID};
        var query = connection.query('SELECT * FROM WebUsers WHERE ?', post, function(err, result) {
            if (result[0] !== undefined) {
                if (googleID === result[0].googleID && password === result[0].userPassword) {
                    //console.log("success");
                    res.send("success");
                    user = googleID;
                }
                else {
                    res.send("failed");
                }
            }
            else {
                res.send("failed");
            }
        });
        //console.log(query.sql);
    });
});

router.get("/registerUser", function (request, response) {
    //console.log("[200] " + request.method + " to " + request.url);
    var urlPieces = request.url.split("firstName=");
    var urlPieces2 = urlPieces[1].split("&googleID=");
    var urlPieces3 = urlPieces2[1].split("&lastName=");
    var urlPieces4 = urlPieces3[1].split("&password=");

    var firstName = urlPieces2[0];
    //console.log(firstName);
    var lastName = urlPieces4[0];
    //console.log(lastName);
    var googleID = urlPieces3[0];
    //console.log(googleID);
    var password = urlPieces4[1];
    //console.log(password);
    connection.connect(function(err) {
        var post  = {googleID: googleID};
        var query = connection.query('SELECT * FROM WebUsers WHERE ?', post, function(err, result) {
            //console.log(result);
            if (result == "") {
                connection.connect(function (err) {
                    var post = {firstName: firstName, lastName: lastName, googleID: googleID, userPassword: password};
                    var query = connection.query('INSERT INTO WebUsers SET ?', post, function (err, result) {
                    });
                    //console.log(query.sql);
                });
                response.send("success");
                user = googleID;
            }
            else {
                response.send("failure");
            }
        });
        //console.log(query.sql);
    });
});

router.get("/listCommunities", function (request, response) {
    //console.log("[200] " + request.method + " to " + request.url);
    var query = connection.query('SELECT * FROM Communities', function(err, result) {
        //connection.end();
        if (err) throw err;
        else {
            var communities = result;
            response.send(communities);
        }
    });
});

router.get("/validateCommunity", function (request, response) {
    //console.log("[200] " + request.method + " to " + request.url);\
    //console.log(request.url);
    var urlPieces = request.url.split("?category=");
    var urlPieces2 = urlPieces[1].split("&communityName=");
    var urlPieces3 = urlPieces2[1].split("&subcategory=");

    var category = urlPieces2[0];
    category = category.replace(/\+/g, " ");
    var subcategory = urlPieces3[1];
    subcategory = subcategory.replace(/\+/g, " ");
    var communityName = urlPieces3[0];
    communityName = communityName.replace(/\+/g, " ");
    var post = {category: category, subcategory: subcategory, name: communityName};
    connection.connect(function(err) {
        var query = connection.query('INSERT INTO communities SET ?', post, function(err, result) {});
    });
    connection.connect(function(err) {
        var tableDef = 'CREATE TABLE ' + communityName.replace(/ /g, "_") + '_Board (idMessage INT(4) AUTO_INCREMENT NOT NULL PRIMARY KEY, pinned INT(4), name VARCHAR(255), date DATE, message TEXT CHARACTER SET latin1 COLLATE latin1_general_cs)'
        var query = connection.query(tableDef, function(err, result) {});
    });
    response.send(post);
});

router.get("/room/:community", function (request, response) {
    //console.log("[200] " + request.method + " to " + request.url);
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
        //console.log("room is " + room);
        response.write('<form enctype="application/x-www-form-urlencoded" action="'+room+'" method="post">');
        response.write('Message: <input type="text" name="message" value="" style="width:100%;" /><br />');
        response.write('<input type="submit" /></html>');
    });
});
router.post("/room/:community", function (request, response) {
    //console.log("[200] " + request.method + " to " + request.url);
    var communityName = request.params.community.replace(/ /g, "_");
    var room = "/room/";
    room += communityName;
    communityName += "_Board";
    var message = request.body.message;
    connection.connect(function(err) {
        var post  = {name: user, message: message};
        var query = connection.query('INSERT INTO ' + communityName + ' SET ?', post, function(err, result) {});
        //console.log(query.sql);
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
        //console.log(query.sql);
        //console.log("post room is " + room);
        response.write('<form enctype="application/x-www-form-urlencoded" action='+room+' method="post">');
        response.write('Message: <input type="text" name="message" value="" style="width:100%;" /><br />');
        response.write('<input type="submit" /></html>');
    });
});

module.exports = router;