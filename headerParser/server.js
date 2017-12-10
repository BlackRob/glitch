// FYI this doesn't work when run locally
// because there's no "x-forwarded-for" in headers
// when requesting from localhost :(

var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.text())

app.get('/', function (request, response) {
  let ipString = request.headers['x-forwarded-for']
  let ipv4 = ipString.slice(0, ipString.indexOf(','))
  let langString = request.headers['accept-language']
  let lang = langString.slice(0, langString.indexOf(','))
  let swString = request.headers['user-agent']
  let os = swString.slice(swString.indexOf('(') + 1, swString.indexOf(')'))
  let sendBack = {
    'ipaddress': ipv4,
    'language': lang,
    'software': os
  }
  response.send(sendBack)
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
