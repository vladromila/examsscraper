let express = require("express");
const webpush = require("web-push");
var path = require('path');
var admin = require("firebase-admin");
var serviceAccount = require("./akeys.json");
const publicVapidKey = 'BP_V0TZXgtx__iFNal1fR5QIYwRLwPdhmhVM6X82P88DsT9zjJeDocvpX3vH_4cEhAMsQIdkXHuSOI1i1qj9Ogs';
const privateVapidKey = "PQAU7Lqki91x70jKzWBv67Tmz3e6FI2olUX8WZHcDPA";
let months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"]
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://examsscraper.firebaseio.com"
});

webpush.setVapidDetails('mailto:romilavlad2001@gmail.com', publicVapidKey, privateVapidKey);

const app = express();

app.use(require('body-parser').json());
app.use(express.static(__dirname + "/public"))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: "Notificarile au fost activate cu succes!", body: "Veti fi notificat cand vor aparea locuri libere pentru programare pe toate device-urile unde acceptati notificarile" });

    admin.database().ref("/subscriptions/").push(JSON.stringify(subscription))

    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
    });
});

app.post('/send', async (req, res) => {
    console.log(req.body);
    admin.database().ref("/subscriptions/").once("value", async snapshot => {
        let data = snapshot.val();
        if (data) {
            let subscriptions = [];
            Object.keys(data).forEach(key => {
                subscriptions.push(JSON.parse(data[key]))
            })
            await Promise.all(subscriptions.map(async subscription => {
                await req.body.dates.forEach(async date => {
                    await webpush.sendNotification(subscription, JSON.stringify({ title: `${date.day} ${months[date.month]} ${date.year}`, body: `${date.day} ${months[date.month]} ${date.year} disponibil` })).catch(error => {
                        console.error(error.stack);
                    })
                })

            })
            )
            res.status(201).json({ status: "Success" });
        }
    })
})
app.post('/error', async (req, res) => {
    admin.database().ref("/subscriptions/").once("value", async snapshot => {
        let data = snapshot.val();
        if (data) {
            let subscriptions = [];
            Object.keys(data).forEach(key => {
                subscriptions.push(JSON.parse(data[key]))
            })
            await Promise.all(subscriptions.map(async subscription => {
                await webpush.sendNotification(subscription, JSON.stringify({ title: "Eroare", body: "Unul din device uri are o eraore" })).catch(error => {
                    console.error(error.stack);
                })
            })
            )
            res.status(201).json({ status: "Success" });
        }
    })
})


app.listen(process.env.PORT || 3000);