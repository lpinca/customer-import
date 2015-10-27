'use strict';

var JSONStream = require('JSONStream')
  , Client = require('./client')
  , worker = require('./worker')
  , async = require('async');

/**
 * Import the customers from a stream of JSON data.
 *
 * @public
 * @constructor
 * @param {Object} options Configuration options
 */
function Loader(options) {
  this.parse = JSONStream.parse(options.path || 'customers.*');
  this.concurrency = options.concurrency || 50;
  this.queue = async.queue(worker.bind(this), this.concurrency);
  this.client = new Client(options.client);
  this.stream = options.stream;

  this.endEmitted = false;
  this.created = 0;
  this.updated = 0;

  this.initialize();
}

/**
 * Adds the events listeners and the required callbacks.
 *
 * @private
 * @return {Loader} `this`
 */
Loader.prototype.initialize = function initialize() {
  var loader = this;

  this.taskComplete = this.taskComplete.bind(this);
  this.parse.on('data', function push(task) {
    loader.queue.push(task, loader.taskComplete);
  });
  this.parse.on('end', function end() {
    loader.endEmitted = true;
  });
  this.queue.saturated = function saturated() {
    loader.parse.pause();
  };
  this.queue.drain = function drain() {
    if (loader.endEmitted) process.stdout.write('\n');
  };

  return this;
};

/**
 * This method gets called when a task completes.
 *
 * @private
 * @param {Error} [err] The possible error returned by the task
 * @return {Loader} `this`
 */
Loader.prototype.taskComplete = function taskComplete(err) {
  if (err) console.error(err);

  process.stdout.write('customer-import: created ' + this.created);
  process.stdout.write(', updated ' + this.updated + '\r');

  if (!this.queue.length() && !this.endEmitted) {
    this.parse.resume();
  }
};

/**
 * Starts the loader.
 *
 * @public
 * @return {Loader} `this`
 */
Loader.prototype.start = function () {
  this.stream.pipe(this.parse);

  return this;
};

//
// Expose the Loader constructor.
//
module.exports = Loader;
