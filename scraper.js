let scraper = require("puppeteer");
let express = require("express");
const webpush = require("web-push");
var path = require('path');
var admin = require("firebase-admin");
let settings = require("./data.json");
let request = require("request");

let sendData = async (toSendDates) => {
    await request({
        url: 'http://examsscraper.herokuapp.com/send',
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: {
            dates: [toSendDates[0]]
        },
        json: true
    }
    )
}
scraper.launch({
    headless: false,
    userDataDir: "~/Library/Application Support/Google/Chrome",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions'],
}).then(async (browser) => {
    let page = await browser.newPage();
    await page.goto("https://drpciv.ro/drpciv-booking/formular/22/theoryExamination")
    let func = async () => {
        await page.reload();
        setTimeout(async () => {
            let button = await page.$("a.next");
            await page.evaluate((settings) => {
                document.querySelector("#last-name").value = settings.nume
                document.querySelector("#first-name").value = settings.prenume
                document.querySelector("#email").value = settings.email
                document.querySelector("#file-number").value = settings.nrf;
            }, settings)
            let dates = await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: new Date().getMonth(), year: new Date().getFullYear() } }));
            let toSendDates = []
            dates.forEach(date => {
                if (new Date(date.year, date.month, date.day, 0, 0, 0, 0) < new Date(settings.maxDate.year, settings.maxDate.month, settings.maxDate.day, 0, 0, 0, 0))
                    toSendDates.push(date);
            })
            if (toSendDates.length)
                await sendData(toSendDates)
            else {
                button.click();
                setTimeout(async () => {
                    dates.push(...await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: (new Date().getMonth() + 1) % 12, year: new Date().getMonth() + 1 >= 12 ? new Date().getFullYear() + 1 : new Date().getFullYear() } })));
                    let toSendDates = []
                    dates.forEach(date => {
                        if (new Date(date.year, date.month, date.day, 0, 0, 0, 0) < new Date(settings.maxDate.year, settings.maxDate.month, settings.maxDate.day, 0, 0, 0, 0))
                            toSendDates.push(date);
                    })
                    if (toSendDates.length)
                        await sendData(toSendDates)
                    else {
                        await button.click();
                        setTimeout(async () => {
                            dates.push(...await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: (new Date().getMonth() + 2) % 12, year: new Date().getMonth() + 2 >= 12 ? new Date().getFullYear() + 1 : new Date().getFullYear() } })));
                            let toSendDates = []
                            dates.forEach(date => {
                                if (new Date(date.year, date.month, date.day, 0, 0, 0, 0) < new Date(settings.maxDate.year, settings.maxDate.month, settings.maxDate.day, 0, 0, 0, 0))
                                    toSendDates.push(date);
                            })
                            if (toSendDates.length)
                                await sendData(toSendDates)
                            else {
                                await button.click();
                                setTimeout(async () => {
                                    dates.push(...await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: (new Date().getMonth() + 3) % 12, year: new Date().getMonth() + 3 >= 12 ? new Date().getFullYear() + 1 : new Date().getFullYear() } })));
                                    let toSendDates = []
                                    dates.forEach(date => {
                                        if (new Date(date.year, date.month, date.day, 0, 0, 0, 0) < new Date(settings.maxDate.year, settings.maxDate.month, settings.maxDate.day, 0, 0, 0, 0))
                                            toSendDates.push(date);
                                    })
                                    if (toSendDates.length)
                                        await sendData(toSendDates)
                                    else {
                                        await button.click();
                                        setTimeout(async () => {
                                            dates.push(...await page.$$eval("td.available-day", data => data.map(date => { return { day: JSON.parse(date.children[0].innerHTML), month: (new Date().getMonth() + 4) % 12, year: new Date().getMonth() + 4 >= 12 ? new Date().getFullYear() + 1 : new Date().getFullYear() } })));
                                            let toSendDates = []
                                            dates.forEach(date => {
                                                if (new Date(date.year, date.month, date.day, 0, 0, 0, 0) < new Date(settings.maxDate.year, settings.maxDate.month, settings.maxDate.day, 0, 0, 0, 0))
                                                    toSendDates.push(date);
                                            })
                                            if (toSendDates.length)
                                                await sendData(toSendDates)
                                            else
                                                func();
                                        }, 1000)
                                    }
                                }, 1000)
                            }
                        })
                    }
                }, 1000)
            }
        }, 2500)
    }
    func();
})
    .catch((e) => {
        request({
            url: 'http://examsscraper.herokuapp.com/error',
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: {
            },
            json: true
        }
        )
    })