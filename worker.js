'use strict';

var buildActions = require('build-actions');

/**
 * Creates or update a customer.
 *
 * @public
 * @param {Object} data Customer object
 * @param {next} Callback
 */
function worker(data, next) {
  var email = encodeURIComponent('email="' + data.email + '"')
    , client = this.client
    , loader = this;

  //
  // For the same of simplicity assume that the `email` field is good enough
  // to uniquely match a customer.
  // @todo This is actually not a good idea because the email can be updated.
  //
  client.get('/customers?where=' + email, function get(err, res, body) {
    if (err || res.statusCode !== 200) {
      return next(err || new Error(body.message));
    }

    var customer = body.results[0];

    if (!customer) {
      //
      // If a match has not been found, create the customer.
      // @todo Pick only the valid properties from `data`.
      //
      client.post('/customers', data, function post(err, res, body) {
        if (err || res.statusCode !== 201) {
          return next(err || new Error(body.message));
        }

        loader.created++;
        next();
      });

      return;
    }

    var actions = buildActions(customer, data);

    //
    // Bail out if there are no changes, otherwise update the customer.
    //
    if (!actions.length) return next();

    client.post('/customers/' + customer.id, {
      version: customer.version,
      actions: actions
    }, function post(err, res, body) {
      if (err || res.statusCode !== 200) {
        return next(err || new Error(body.message));
      }

      loader.updated++;
      next();
    });
  });
}

//
// Expose the `worker` function.
//
module.exports = worker;
