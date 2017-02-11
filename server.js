'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var body_parser = require('body-parser');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/public', express.static(process.cwd() + '/public'));

app.set('view engine', 'pug');

app.use(session({
  secret: 'secretClementine',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: true}))

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
  console.log('Node.js listening on port ' + port + '...');
});
