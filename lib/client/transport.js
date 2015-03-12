var utils = require('../utils');
var Client = require('../client');

/**
 *  Constructor for a Jayson General Transport Client
 *  @class Jayson JSON-RPC General Transport Client
 *  @constructor
 *  @extends Client
 *  @param {Object|String} [options] Optional hash of settings or a URL
 *  @return {TransportClient}
 *  @api public
 */
var TransportClient = function(sendProc, options) {
  if(!(this instanceof TransportClient)) return new TransportClient(sendProc, options);
  Client.call(this, options);

  var defaults = utils.merge(this.options, {
    encoding: 'utf8'
  });

  this.options = utils.merge(defaults, options || {});
  this.sendProc = sendProc;
  this.reqs = {};
  this.response = function (data) {
    if (data.id) {
      var id = data.id.toString();
      var req = this.reqs[id];
      if (req) {
        clearTimeout(req.timeoutId);
        req.callback(null, data);
        delete this.reqs[id];
      }
    }
  };
};
require('util').inherits(TransportClient, Client);

module.exports = TransportClient;

TransportClient.prototype._request = function(request, callback) {
    var self = this;

    if(utils.Request.isNotification(request)) {
        self.sendProc(request);
        callback();
    } else {
        var id = request.id.toString();
        self.sendProc(request);
        self.reqs[id] = {callback: callback, timeoutId: setTimeout(function() {
            console.log('response timeout for id :', id);
            delete self.reqs[id];
        }, 60 * 1000)}; // 1minutes timeout
    }
};
