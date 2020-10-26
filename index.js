let express = require("express");
var path = require('path');
var admin = require("firebase-admin");
let request = require("request");
var serviceAccount = require("./akeys.json");
let programareSala = require('./programare-sala')
var cors = require('cors');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://examsscraper.firebaseio.com"
});

const app = express();
app.use(cors())
app.use(express.static(__dirname + "/public"))

let interval = null
admin.database().ref("/users").on("value", users => {
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
    console.log(isAtLeastOneUser, toVerifyUsers);
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
                        admin.database().ref(`/${user}/date`).once("value", date => {
                            if (date) {
                                let selectedDate = new Date(date.val());
                                let goodDates = [];
                                body.forEach(d => {
                                    if (new Date(d) <= selectedDate)
                                        goodDates.push(d)
                                })
                                admin.database().ref(`/${user}/dates/`).set(JSON.stringify(goodDates))
                            }
                        })
                    })
                }
            }
            )
        }, 1000)
})

app.use(require('body-parser').json());

app.use('/programare-sala', programareSala)

app.post('/applepay', (req, res) => {
    console.log("REQUEST APPLE!");
    console.log(req.body);
    res.status(200);
    res.end();
})

app.listen(process.env.PORT || 3500);