describe('customer-import', function () {
  'use strict';

  var server = require('http').createServer(require('./server'))
    , childProcess = require('child_process')
    , assert = require('assert')
    , path = require('path');

  it('works', function (next) {
    this.timeout(2 * 60 * 1000);

    server.on('listening', function () {
      childProcess.execFile(path.join(__dirname, '../cli.js'), [
        'test/fixtures/customers.json'
      ], function (err, stdout) {
        if (err) return next(err);

        assert(stdout.trim(), 'customer-import: created 8000, updated 8000');
        server.close(next);
      });
    });

    server.listen(3000);
  });
});
