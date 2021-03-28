var express = require('express'),
    router = express.Router();
var path = require('path');
let app = express()
app.use(express.static(__dirname + "/public"))

router
    .get('/romila-iulian', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/romila-vlad', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/popescu-ciprian', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/*', (req, res) => {
        res.send("Link invalid, sunati ma daca vreti si voi si va zic cat costa :P")
    })

module.exports = router;