//require all usefull modules
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
mongoose.connect('mongodb://localhost/quotingDojo');

//set up server
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'/static')));
app.set('views', path.join(__dirname,'./views'));
app.set('view engine', 'ejs');

app.get('/', function (req,res) {
  res.render('index', {message:"Welcome to Quoting Dojo"});
})

app.listen(8899,function () {
  console.log('listening to 8899');
})

//create DB
var QuoteDojoSchema = new mongoose.Schema({
  name:String,
  quote:String,
  likes:Number,
  created: Date
})

mongoose.model('Quote', QuoteDojoSchema);
var Quote = mongoose.model('Quote');

app.post('/quote', function (req,res) {
  console.log(req.body);
  if (req.body.name == '' || req.body.quote == '') {
    res.render('index',{message:'Please enter your name/quote'})
  }
  var quote = new Quote({name:req.body.name, quote:req.body.quote, likes:0,created:Date.now()})
  quote.save(function (err) {
    if (err) {
      console.log(err);
      res.render('index',{message:'Please enter again'})
    }else{
      res.render('index',{message:'You have successfully add a new quote'})
    }
  });
});

app.get('/quotes', function (req,res) {
  Quote.find({}).sort({'likes':-1}).exec(function (err,quotes) {
    if (!err) {
      res.render('quotes',{quotes:quotes});
    }else{
      console.log(err);
      res.redirect('/');
    }
  })
});

app.post('/like' ,function (req,res) {
  console.log(req.body.quote);
  Quote.update({quote:req.body.quote},{$inc:{likes:1}}).exec(function (err) {
    if (err) {
      console.log(err);
    }else {
      res.redirect('/quotes');

    }
  });
  // Quote.update({quote:req.body.quote},{$set: likes:++})
})
