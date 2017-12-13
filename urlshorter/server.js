const express = require('express')
const mongoose = require('mongoose')
const validUrl = require('valid-url')
const {handleErr} = require('./helpers')
const {genId} = require('./helpers')

const app = express()

// Set up default mongoose connection
const mongoDB = 'mongodb://' + process.env.DBUSER +
    ':' + process.env.DBPASSWORD +
    '@' + process.env.DBURL
mongoose.connect(mongoDB, { useMongoClient: true })
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise
const db = mongoose.connection
const Schema = mongoose.Schema
const urlSchema = new Schema({ url: String, shorty: String })
const urlModel = mongoose.model('Url', urlSchema)

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

app.set('view engine', 'pug')
app.get('/', function (req, res) {
  let thisUrl = 'https://' + req.hostname + '/'
  res.render('index', {url: thisUrl})
})
// ignore favicon requests
app.get('/favicon.ico', function (req, res) {
  res.end()
})

app.get('/*', function (req, res) {
  let x = req.params[0]
  let newPair = {
    'url': x,
    'shorty': genId()
  }
   // if the argument part of the current URL (host+arg)
   // is a valid URI we check if it has a shortcut; if not we
   // create one; either way we return a JSON object with the url
   // and the shortcut
  if (validUrl.isUri(x)) {
    console.log('Looks like a URI')
    urlModel.findOne({'url': x}, function (err, doc) {
      if (err) {
        handleErr(err)
      } else {
        console.log(doc)
        if (doc !== null) {
          res.json({'url': doc.url, 'shorty': doc.shorty})
          res.end()
        } else {
          let newDoc = new urlModel(newPair)
          newDoc.save(function (err, doc) {
            if (err) {
              handleErr(err)
            } else {
              res.json({'url': doc.url, 'shorty': doc.shorty})
              res.end()
            }
          })
        }
      }
    })
   // If "argument" is not a URI, we check if it matches a shortcut
   // in our database; if so, we redirect to the corresponding URL;
   // if not,
  } else {
    urlModel.findOne({'shorty': x}, function (err, doc) {
      if (err) {
        handleErr(err)
      } else {
        console.log('Not a URI')
        if (doc !== null) {
          res.redirect(doc.url)
        } else {
          res.json({'error': 'unknown shortcut'})
          res.end()
        }
      }
    })
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
