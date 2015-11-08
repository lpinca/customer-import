'use strict';

var bodyParser = require('body-parser')
  , express = require('express')
  , assert = require('assert')
  , http = require('http');

var data = {
  req: {
    create: require('./fixtures/request/create'),
    update: require('./fixtures/request/update')
  },
  res: {
    notfound: require('./fixtures/response/notfound'),
    create: require('./fixtures/response/create'),
    update: require('./fixtures/response/update'),
    found: require('./fixtures/response/found')
  }
};

var app = express()
  , delay = 10;

app.use(bodyParser.json());

app.get('/customers', function exists(req, res) {
  var customer = req.query.where !== 'email="foo.bar@domain.com"'
    ? data.res.notfound
    : data.res.found;

  setTimeout(function () {
    res.send(customer);
  }, delay);
});

app.post('/customers', function validate(req, res, next) {
  try {
    assert.deepEqual(req.body, data.req.create);
  } catch (e) {
    return res.status(400).send({
      statusCode: 400,
      message: http.STATUS_CODES[400]
    });
  }

  next();
}, function create(req, res) {
  setTimeout(function () {
    res.status(201).send(data.res.create);
  }, delay);
});

app.post('/customers/:id', function validate(req, res, next) {
  if (req.params.id !== '4d42a6f9-0cf6-4198-9a3d-e2328f14fb4d') {
    return res.status(404).send({
      statusCode: 404,
      message: http.STATUS_CODES[404]
    });
  }

  try {
    assert.deepEqual(req.body, data.req.update);
  } catch (e) {
    return res.status(400).send({
      statusCode: 400,
      message: http.STATUS_CODES[400]
    });
  }

  next();
}, function update(req, res) {
  setTimeout(function () {
    res.send(data.res.update);
  }, delay);
});

if (!module.parent) {
  app.listen(3000, function () {
    console.log('server listening on *:3000');
  });
} else {
  module.exports = app;
}
