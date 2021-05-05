var express = require('express'),
    router = express.Router();
var path = require('path');
let app = express()
const fetch = require("node-fetch")
var admin = require("firebase-admin");

app.use(express.static(__dirname + "/public"))

router
    .get('/romila-iulian', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/romila-iulian/save/:token', async (req, res) => {

        admin.database().ref('/sala/romila-iulian/data').once("value", async snapshot => {
            if (snapshot.val()) {
                await fetch("https://www.drpciv.ro/drpciv-booking-api/reservation/save", {
                    "headers": {
                        "accept": "application/json",
                        "accept-language": "en,en-US;q=0.9,ro-RO;q=0.8,ro;q=0.7",
                        "cache-control": "no-cache, no-store, must-revalidate",
                        "content-type": "application/json",
                        "expires": "0",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not\\\"A\\\\Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?1",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin"
                    },
                    "referrer": "https://www.drpciv.ro/drpciv-booking/formular/22/theoryExamination",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": "{\"firstName\":\"Romila\",\"lastName\":\"Vlad\",\"fileNumber\":\"2758558\",\"email\":\"romilavlad2001@gmail.com\",\"phone\":\"\",\"personalIdentificationNumber\":\"\",\"plateNumber\":\"\",\"chassisNumber\":\"\",\"countyCode\":22,\"activityCode\":1,\"startHour\":\"09:20\",\"date\":\"2021/07/06\",\"boothIds\":[665,366],\"reCaptchaKey\":" + '"' + req.params.token + '"}',
                    "method": "POST",
                    "mode": "cors"
                }).then(res => {
                    return res.json();
                })
                    .then(res => {
                        admin.database().ref('/sala/romila-iulian/saveResponse').set(JSON.stringify({ ...res, usedBody: `{"firstName":"${snapshot.val().firstName}","lastName":"${snapshot.val().lastName}","fileNumber":"${snapshot.val().fileNumber}","email":"${snapshot.val().email}","phone":"","personalIdentificationNumber":"","plateNumber":"","chassisNumber":"","countyCode":22,"activityCode":1,"startHour":"${snapshot.val().startHour}","date":"${snapshot.val().date}","boothIds":[665,366],"reCaptchaKey":"${req.params.token}"}` }));
                    })
            }

            res.send("done");
        })
    })
    .get('/romila-vlad', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/romila-vlad/save/:token', async (req, res) => {

        admin.database().ref('/sala/romila-vlad/data').once("value", async snapshot => {
            if (snapshot.val()) {
                await fetch("https://www.drpciv.ro/drpciv-booking-api/reservation/save", {
                    "headers": {
                        "accept": "application/json",
                        "accept-language": "en,en-US;q=0.9,ro-RO;q=0.8,ro;q=0.7",
                        "cache-control": "no-cache, no-store, must-revalidate",
                        "content-type": "application/json",
                        "expires": "0",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not\\\"A\\\\Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?1",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin"
                    },
                    "referrer": "https://www.drpciv.ro/drpciv-booking/formular/22/theoryExamination",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `{"firstName":"${snapshot.val().firstName}","lastName":"${snapshot.val().lastName}","fileNumber":"${snapshot.val().fileNumber}","email":"${snapshot.val().email}","phone":"","personalIdentificationNumber":"","plateNumber":"","chassisNumber":"","countyCode":22,"activityCode":1,"startHour":"${snapshot.val().startHour}","date":"${snapshot.val().date}","boothIds":[665,366],"reCaptchaKey":"${req.params.token}"}`,
                    "method": "POST",
                    "mode": "cors"
                }).then(res => {
                    return res.json();
                })
                    .then(res => {
                        admin.database().ref('/sala/romila-vlad/saveResponse').set(JSON.stringify({ ...res, usedBody: `{"firstName":"${snapshot.val().firstName}","lastName":"${snapshot.val().lastName}","fileNumber":"${snapshot.val().fileNumber}","email":"${snapshot.val().email}","phone":"","personalIdentificationNumber":"","plateNumber":"","chassisNumber":"","countyCode":22,"activityCode":1,"startHour":"${snapshot.val().startHour}","date":"${snapshot.val().date}","boothIds":[665,366],"reCaptchaKey":"${req.params.token}"}` }));
                    })
            }

            res.send("done");
        })
    })
    .get('/popescu-ciprian', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/*', (req, res) => {
        res.send("Link invalid, sunati ma daca vreti si voi si va zic cat costa :P")
    })

module.exports = router;