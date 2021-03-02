const path = require('path')
const cors = require('cors')
const bodyparser = require('body-parser')
const url = require('url')
const fetch = require('node-fetch')
const express = require('express')
let trips = []

const app = express()
app.use(cors())
app.use(bodyparser.json())
app.use(express.static('dist'))

app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'))
})

app.get('/trips/all', async (req, res) => {
    res.send(trips)
});

app.post('/trips/new', async (req, res) => {
    let id = parseInt(new Date().getTime())
    let { destination, date } = req.body
    let geonameAPIUrl = `http://api.geonames.org/searchJSON?q=${destination}&username=gavingeoname`
    let { lng, lat, name, countryName } = await fetch(geonameAPIUrl)
        .then(resp => resp.json())
        .then(data => data.geonames[0])
        .catch(e => console.error(e))
    let weatherbitAPIUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=012323b3ed8840079af5c645d63f9732`
    let entry = await fetch(weatherbitAPIUrl)
        .then(resp => resp.json())
        .then(data => {
            return data.data.filter(entry => entry.datetime == date)[0]
        })
    console.log(entry)
    let { low_temp, high_temp } = entry
    let { icon, description } = entry.weather
    let pixabayAPIUrl = `https://pixabay.com/api/?q=${destination}&key=20380678-a377a2477c8f32342cabd5915`
    let thumbnailUrl = await fetch(pixabayAPIUrl)
        .then(resp => resp.json())
        .then(data => {
            if (data.total > 0) {
                return data.hits[0].previewURL
            }
        })
    let trip = {
        "id": id,
        "destination": {
            "name": name,
            "countryName": countryName,
            "thumbnailUrl": thumbnailUrl
        },
        "date": date,
        "weather": {
            "low_temp": low_temp,
            "high_temp": high_temp,
            "icon": icon,
            "description": description
        },
        "notes": ""
    }
    trips.push(trip)
    res.send(trip)
})

app.get('/trips/:tripId', (req, res) => {
    let id = req.params.tripId
    let trip = trips.filter(trip => trip.id == id)[0]
    res.send(JSON.stringify(trip))
});


app.post('/trips/:tripId', (req, res) => {
    let id = req.params.tripId
    let { notes } = req.body
    let trip = trips.filter(trip => trip.id == id)[0]
    trip.notes = notes
    res.send(JSON.stringify(trips))
});

app.delete('/trips/:tripId', (req, res) => {
    let id = req.params.tripId
    console.log("deleting "+id)
    trips = trips.filter(trip => trip.id != id)
    console.log(trips.length)
    res.send(JSON.stringify(trips))
});