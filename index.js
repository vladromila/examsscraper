let express = require("express");
var path = require('path');
var admin = require("firebase-admin");
let request = require("request");
var bodyParser = require('body-parser')
var serviceAccount = require("./akeys.json");
let programareSala = require('./programare-sala');
let programareNumere = require('./programare-numere');
let electron = require('./electron')
var cors = require('cors');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://examsscraper.firebaseio.com"
});

const app = express();
app.use(cors())
app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/build"))


let interval = null
admin.database().ref("/sala/users").on("value", users => {
    clearInterval(interval);
    let toVerifyUsers = [];
    let isAtLeastOneUser = false
    if (users.val())
        Object.keys(users.val()).forEach(key => {
            if (users.val()[key].enabled === true) {
                toVerifyUsers.push(key);
                isAtLeastOneUser = true
            }
        })
    if (isAtLeastOneUser === true)
        interval = setInterval(() => {
            request({
                url: 'https://www.drpciv.ro/drpciv-booking-api/getAvailableDaysForSpecificService/1/22',
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
                body: {
                },
                json: true
            }, (err, res, body) => {
                if (!err) {
                    toVerifyUsers.forEach(user => {
                        admin.database().ref(`/sala/${user}/date`).once("value", date => {
                            if (date) {
                                let selectedDate = new Date(date.val());
                                let goodDates = [];
                                body.forEach(d => {
                                    if (new Date(d) <= selectedDate)
                                        goodDates.push(d)
                                })
                                admin.database().ref(`/sala/${user}/dates/`).set(JSON.stringify(goodDates))
                            }
                        })
                    })
                }
                else { }
            }
            )
        }, 1000)
})
let interval2 = null;
admin.database().ref("/numere/users").on("value", users => {
    clearInterval(interval2);
    let toVerifyUsers = [];
    let isAtLeastOneUser = false
    if (users.val())
        Object.keys(users.val()).forEach(key => {
            if (users.val()[key].enabled === true) {
                toVerifyUsers.push(key);
                isAtLeastOneUser = true
            }
        })
    if (isAtLeastOneUser === true)
        interval2 = setInterval(() => {
            request({
                url: 'https://www.drpciv.ro/drpciv-booking-api/getAvailableDaysForSpecificService/8/22',
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
                body: {
                },
                json: true
            }, (err, res, body) => {
                if (!err) {
                    toVerifyUsers.forEach(user => {
                        admin.database().ref(`/numere/${user}/date`).once("value", date => {
                            if (date) {
                                let selectedDate = new Date(date.val());
                                let goodDates = [];
                                body.forEach(d => {
                                    if (new Date(d) <= selectedDate)
                                        goodDates.push(d)
                                })
                                admin.database().ref(`/numere/${user}/dates/`).set(JSON.stringify(goodDates))
                            }
                        })
                    })
                }
            }
            )
        }, 1000)
})

app.use('/programare-sala', programareSala);

app.use('/programare-numere', programareNumere);

app.use('/electron', electron);

app.post('/applepay', (req, res) => {
    res.status(200);
    res.end();
})

app.listen(process.env.PORT || 3500);