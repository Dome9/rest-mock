var lib = require('../');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var mock = new lib();

mock.resource('/config', { development: true });
mock.collection('/ips', [{ip: '192.1.1.1'}, {ip: '192.1.1.2'}, {ip: '192.1.1.3'}]);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', mock.middleware());

app.listen(3000);