const path = require('path')
const cors = require('cors')
const url = require('url')
const express = require('express')
const analyseMeaningFromUrl = require('./meaningCloudAPI.js')

const app = express()
app.use(cors())
app.use(express.static('dist'))

app.listen(5000, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'))
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

app.get('/evaluate', async (req, res) =>{
    let requestUrl = url.parse(req.url,true).query.url
    let resp =await analyseMeaningFromUrl(requestUrl)
    res.send(resp)
})
