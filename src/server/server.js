const path = require('path')
const cors = require('cors')
const url = require('url')
const express = require('express')

const app = express()
app.use(cors())
app.use(express.static('dist'))

app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'))
})


app.get('/trip/check', async (req, res) =>{
    let {destination,date} = url.parse(req.url,true).query
    console.log(destination,date)

    const geonameAPIUrl = 'http://api.geonames.org/searchJSON?q=chengdu&username=gavingeoname'
    const weatherbitAPIUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=40.71427&lon=-74.00597&key=012323b3ed8840079af5c645d63f9732'
    const pixabayAPIUrl = 'https://pixabay.com/api/?q=chengdu&key=20380678-a377a2477c8f32342cabd5915'

    res.send({"destination":"Tokyo","date":"2/2/2022","weather":"good"})

})
