var express = require('express'),
    router = express.Router();
var path = require('path');
let app = express()
app.use(express.static(__dirname + "/public"))

router
    .get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/video', function (req, res) {
        res.redirect("https://www.youtube.com/watch?v=m5fvrgFDdGQ")
    })
    .get('/download', function (req, res) {
        res.redirect("https://vladromila.ro/resurse/1A1_ROMILA-VLAD-ALEXANDRU-TERENTI-ION_ELECTRON.zip")
    })

module.exports = router;