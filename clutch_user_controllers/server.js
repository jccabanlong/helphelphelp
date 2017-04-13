'use strict'

var express = require('express');
var router = require('./routes/router');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret: 'useless',
	resave: false,
	saveUninitialized: false
}));

app.use(express.static(__dirname+'/bower_components'));
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/app'));
app.use(router);

app.listen(3000);
console.log('Server running...')
