const express = require('express');
const request = require('request');
const fs = require('fs');
const axios = require('axios').default;
const path = require('path')
const app = express()
const port = process.env.PORT || 8765
let citis_obj = {};
const DateDiff = {

    inMinutes: function(d2, d1) {
        var t2 = new Date(d2).getTime();
        var t1 = new Date(d1).getTime();

        return parseInt(((t2-t1)/1000)/60);
    },

    inHours: function(d1, d2) {
        var t2 = new Date(d2).getTime();
        var t1 = new Date(d1).getTime();

        return parseInt((t2-t1)/(3600*1000));
    },

    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000));
    },

    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000*7));
    },

    inMonths: function(d2, d1) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },

    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}

const getAlerts = () => {
    const url = 'https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=3'
    const options = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'https://www.oref.org.il/12481-he/Pakar.aspx'
      }
    };
    axios.get(url, options).then((res) => {
        const currentDate = new Date().toLocaleString("en-US", {timeZone: 'Asia/Jerusalem'});
        const rawData = res.data;
        let cities = {}
        for(let i=0; i< rawData.length; i++){
            console.log(rawData[i].data)
            if(cities[rawData[i].data] == null){
                cities[rawData[i].data] = {
                    count:1,
                    name: rawData[i].data,
                    lastHit: DateDiff.inMinutes(currentDate,rawData[i].datetime)
                }
            } else {
                cities[rawData[i].data].count = cities[rawData[i].data]['count']+1;
                const lastHitCount = DateDiff.inMinutes(currentDate,rawData[i].datetime)
                if(lastHitCount < cities[rawData[i].data].lastHit){
                    cities[rawData[i].data].lastHit = lastHitCount
                }
            }
        }
        console.log(cities)
        citis_obj = cities;
        // let data = JSON.stringify(cities);
        // fs.writeFileSync('cities.json', data);
    })
}

app.use('/', express.static(path.join(__dirname, 'public')))
app.get('/getCities', (req, res) => {
    let obj =  citis_obj

    res.json(obj)
})
getAlerts();

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

