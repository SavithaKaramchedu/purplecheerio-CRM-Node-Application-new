var app = require('purplecheerio-wave');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.startservice("sampleservice", __dirname, "./appserviceconfig.json");
