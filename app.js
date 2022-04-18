var express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var admin = require('./router/admin');
var anonymous = require('./router/anonymous');
const app = express();

app.use(fileUpload({
    createParentPath: true
}));

// app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/data', express.static(process.env.IMAGEPATH || '../blog_images'));
app.use(express.static(process.env.BUILDPATH || '../webpage/build'));
app.use('/api/admin', admin);
app.use('/api/anony', anonymous);

module.exports = app;