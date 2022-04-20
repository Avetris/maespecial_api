var express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var admin = require('./router/admin');
var anonymous = require('./router/anonymous');
const app = express();
require("./.env")

app.use(fileUpload({
    createParentPath: true
}));

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));
app.unsubscribe(cors())
/*
app.use(cors({origin: [
    "http://localhost:4100"
  ], credentials: true}));*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/data', express.static(process.env.IMAGEPATH || '../blog_images'));
app.use(express.static(process.env.BUILDPATH || '../maespecial_webpage/build'));
app.use('/api/admin', admin);
app.use('/api/anony', anonymous);

module.exports = app;