var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

var db_config = {
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b3bd94cf7c5125',
    password : 'b256d9ed',
    database : 'ad_9ddc31f035745cd'
};

var connection = mysql.createConnection(db_config);

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("testing\n");
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

router.post("localhost:3000/validateLogin", function (request, response) {
    console.log("testing");
    var username = request.data.email;
    var password = request.data.password;
    console.log("test");
    connection.connect(function() {
        var post  = {userName: username};
        var query = connection.query('SELECT * FROM WebUsers WHERE ?', post, function(err, result) {
            if (username === result[0].userName && password === result[0].userPassword) {
            }
        });
        console.log(query.sql);
    });
});

module.exports = router;