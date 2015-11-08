#!/usr/bin/env node

'use strict';

var pathIsAbsolute = require('path-is-absolute')
  , Loader = require('./loader')
  , meow = require('meow')
  , path = require('path')
  , fs = require('fs')
  , concurrency
  , loader
  , stream
  , file;

var cli = meow([
  'Usage',
  '  $ customer-import [options] [<file>]',
  '',
  'Options',
  '  -c, --concurrency How many customers should be imported in parallel (20)',
  '  -p, --path        The path used to match the customers (customers.*)',
  '',
  'Examples',
  '  $ customer-import customers.json',
  '  $ customer-import < customers.json',
  '  $ cat customers.json | customer-import'
], {
  alias: {
    c: 'concurrency',
    p: 'path'
  }
});

concurrency = cli.flags.concurrency;
file = cli.input[0];

if (!file) {
  stream = process.stdin;
} else {
  //
  // Build the path and check if the file exists.
  //
  if (!pathIsAbsolute(file)) file = path.join(process.cwd(), file);

  try {
    if (!fs.statSync(file).isFile()) throw new Error('Not a file');
  } catch (e) {
    console.error('customer-import: cannot access %s', file);
    process.exit(1);
  }

  stream = fs.createReadStream(file);
}

if (concurrency && typeof concurrency !== 'number') {
  console.error('customer-import: concurrency must be a numeric value');
  process.exit(1);
}

loader = new Loader({
  concurrency: cli.flags.concurrency,
  path: cli.flags.path,
  stream: stream
});

loader.start();
