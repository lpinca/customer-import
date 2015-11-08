'use strict';

var request = require('request');

/**
 * A dummy client to easily create requests.
 *
 * @public
 * @constructor
 * @param {Object} options Configuration options
 */
function Client(options) {
  options || (options = {});

  this.protocol = options.protocol || 'http:';
  this.host = options.host || 'localhost:3000';
  this.uri = this.protocol + '//' + this.host;
}

/**
 * Sends a GET request to the given endpoint.
 *
 * @public
 * @param {String} endpoint Request endpoint
 * @param {Function} next Callback
 * @return {Client} `this`
 */
Client.prototype.get = function get(endpoint, next) {
  request({
    uri: this.uri + endpoint,
    method: 'GET',
    json: true
  }, next);

  return this;
};

/**
 * Sends a POST request to the given endpoint.
 *
 * @public
 * @param {String} endpoint Request endpoint
 * @param {Object} payload Data paylod to send with the request
 * @param {Function} next Callback
 * @return {Client} `this`
 */
Client.prototype.post = function post(endpoint, payload, next) {
  request({
    uri: this.uri + endpoint,
    method: 'POST',
    json: payload
  }, next);

  return this;
};

//
// Expose the client constructor.
//
module.exports = Client;
