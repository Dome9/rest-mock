# rest-mock

> A REST api middleware for express to mock API requests with full CRUD operations.

`npm i rest-mock --save`

Usage:

```javascript
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
```

You have an example and tests.
