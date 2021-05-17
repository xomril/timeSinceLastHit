const express = require('express');
const request = require('request');
const axios = require('axios').default;
const path = require('path')
const app = express()
const port = process.env.PORT || 8765


const getAlerts = () => {
    const url = 'https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=1'
    const options = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'https://www.oref.org.il/12481-he/Pakar.aspx'
      }
    };
    axios.get(url, options).then((res) => {
   
        const rawData = res.data;
        let cities = {}
        for(let i=0; i< rawData.length; i++){
            console.log(rawData[i].data)
            if(cities[rawData[i].data] == null){
                cities[rawData[i].data] = {
                    count:1,
                    lastHit: rawData[i].datetime
                }
            } else {
                cities[rawData[i].data].count = cities[rawData[i].data]['count']+1;

            }
        }
        console.log(cities)
    })
}

app.use('/', express.static(path.join(__dirname, 'public')))

getAlerts();

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))