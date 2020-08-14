let scraper = require("puppeteer");
let express = require("express");
const webpush = require("web-push");
var path = require('path');
var admin = require("firebase-admin");
let settings = require("./data.json");
let request = require("request");

scraper.launch({
    headless: false,
    userDataDir: "~/Library/Application Support/Google/Chrome",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions'],
}).then(async (browser) => {
    let page = await browser.newPage();
    await page.goto("https://www.drpciv.ro/drpciv-booking/formular/22/theoryExamination")
    let func = async () => {
        await page.reload();
        setTimeout(async () => {
            let button = await page.$("a.next");
            let dates = await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: new Date().getMonth(), year: new Date().getFullYear() } }));
            button.click();
            setTimeout(async () => {
                dates.push(...await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: (new Date().getMonth() + 1) % 12, year: new Date().getMonth() + 1 >= 12 ? new Date().getFullYear() + 1 : new Date().getFullYear() } })));
                await button.click();
                setTimeout(async () => {
                    dates.push(...await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: (new Date().getMonth() + 2) % 12, year: new Date().getMonth() + 2 >= 12 ? new Date().getFullYear() + 1 : new Date().getFullYear() } })));
                    await button.click();
                    setTimeout(async () => {
                        dates.push(...await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: (new Date().getMonth() + 3) % 12, year: new Date().getMonth() + 3 >= 12 ? new Date().getFullYear() + 1 : new Date().getFullYear() } })));
                        await button.click();
                        setTimeout(async () => {
                            dates.push(...await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: (new Date().getMonth() + 4) % 12, year: new Date().getMonth() + 4 >= 12 ? new Date().getFullYear() + 1 : new Date().getFullYear() } })));
                            let toSendDates = []
                            dates.forEach(date => {
                                if (new Date(date.day, date.month, date.year) < new Date(settings.maxDate.day, settings.maxDate.month, settings.maxDate.year))
                                    toSendDates.push(date);
                            })
                            if (toSendDates.length)
                                await request({
                                    url: 'http://localhost:3000/send',
                                    method: "POST",
                                    headers: {
                                        "content-type": "application/json",
                                    },
                                    body: {
                                        dates: toSendDates
                                    },
                                    json: true
                                }
                                )
                        }, 1000)
                    }, 1000)
                })
            }, 1000)
        }, 2500)
    }
    func();
})
    .catch((e) => {
        console.log(e);
    })