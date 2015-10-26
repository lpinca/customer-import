#!/usr/bin/env node

'use strict';

var Loader = require('./loader')
  , meow = require('meow')
  , path = require('path')
  , fs = require('fs')
  , loader
  , stream
  , file;

require('./nock.js');

var cli = meow([
  'Usage',
  '  $ import [<file>]',
  '',
  'Examples',
  '  $ import customers.json',
  '  $ import < customers.json',
  '  $ cat customers.json | import'
]);

file = cli.input[0];

if (!file) {
  stream = process.stdin;
} else {
  //
  // Build the path and check if the file exists.
  //
  if (!path.isAbsolute(file)) file = path.join(process.cwd(), file);

  try {
    if (!fs.statSync(file).isFile()) throw new Error('Not a file');
  } catch (e) {
    console.error('%s does not exists or is not a file', file);
    process.exit(1);
  }

  stream = fs.createReadStream(file);
}

loader = new Loader({ stream: stream });
loader.start();
