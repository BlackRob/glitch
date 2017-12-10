const express = require('express')
const moment = require('moment')
const bodyParser = require('body-parser')


const app = express();
moment().format();

var day = moment("1995-12-25");

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
    let thisUrl = "http://" + req.hostname + '/'
    res.render('index', {url: thisUrl})
})
app.get('/favicon.ico', function (req, res) {
    res.end()
})
app.use(express.static('public'));
app.get('/:streeng', function(req, res){
   let x = req.params.streeng
   let y = Number.parseInt(x) // returns NaN if not a number
   if (!isNaN(y)) {
       x = y * 1000
   }
       
   if (moment(x).isValid()){
       let val = moment.utc(x)
       let returnObj = {
           "unix": val.unix(),
           "natural": val.format("MMMM D, YYYY")
       }
       res.send(returnObj)
       res.end()
   } else { 
       res.send(null)
       res.end()
   }
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
