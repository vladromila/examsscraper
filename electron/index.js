var express = require('express'),
    router = express.Router();
var path = require('path');
let app = express()
app.use(express.static(__dirname + "/public"))

router
    .get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })

module.exports = router;