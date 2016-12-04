var express = require('express');
var router = express.Router();
var path = require('path');

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

module.exports = router;