var express = require('express'),
    router = express.Router();
var path = require('path');
let app = express()
app.use(express.static(__dirname + "/public"))

router
    .get('/romila-iulian', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .post('/romila-iulian/save', function (req, res) {
        const fetch = require("node-fetch")

        fetch("https://www.drpciv.ro/drpciv-booking-api/reservation/save", {
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
            "body": "{\"firstName\":\"Romila\",\"lastName\":\"Vlad\",\"fileNumber\":\"2567597\",\"email\":\"romilavlad2001@gmail.com\",\"phone\":\"\",\"personalIdentificationNumber\":\"\",\"plateNumber\":\"\",\"chassisNumber\":\"\",\"countyCode\":22,\"activityCode\":1,\"startHour\":\"08:40\",\"date\":\"2021/07/14\",\"boothIds\":[665,366],\"reCaptchaKey\":\"03AGdBq26tA7OjH2d0rq04PBK7CkltXPZLSKmIxoc6V4CRTLEd-bS7BtFMUe4QxqhvY_FNxTCR6QfSrI_fXg8VIG-JUFprptIzX0TE_0X8mNf-JdXnwud0S8CdEG0Tzcrfx1JYRxArvBeiw9XqIakRxjrRR9h33MmJtGWrGOXkOIiPZ1EuRAxOPakK_BMos-Fe83e0m1RhPkriUNiL765NrmkyLVSYIhR_mSO-Z3OgW5rqixAdIiEwaSPaX3v70WiZL08kC2DhuJZE_nPTWwBQ7Vg-WnJXr988E9o8NNxA2Xwnhwaa697kaXRiKuTJieKHMtPhtBGOUcBPlZy6zN5eYYoGDnwWGu-LX4yJT5uRZ7ouBHJY6shl6whSDSA36V8aN6-hxHMYt6yfwOJNQI48Ur6WmJBKhui8xHznzArocQro_IQMzdsExLwPcOjfTcZCTjCCC0ITmULl\"}",
            "method": "POST",
            "mode": "cors"
        }).then(res => res.json())
            .then(res => { console.log(res) })
    })
    .get('/romila-vlad', function (req, res) {
        console.log("SALUT VLADE!!");
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/popescu-ciprian', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })
    .get('/*', (req, res) => {
        res.send("Link invalid, sunati ma daca vreti si voi si va zic cat costa :P")
    })

module.exports = router;