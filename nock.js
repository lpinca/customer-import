'use strict';

var create = require('./fixture/request/create')
  , update = require('./fixture/request/update')
  , nock = require('nock')
  , path = require('path');

nock('http://api.sphere.io')
  .persist()
  .get('/customers?where=email%3D%22baz.qux%40domain.com%22')
  .replyWithFile(200, path.join(__dirname, 'fixture/response/notfound.json'))
  .get('/customers?where=email%3D%22foo.bar%40domain.com%22')
  .replyWithFile(200, path.join(__dirname, 'fixture/response/found.json'))
  .post('/customers', create)
  .reply(201)
  .post('/customers/4d42a6f9-0cf6-4198-9a3d-e2328f14fb4d', update)
  .reply(200);
