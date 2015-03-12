var utils = require('../utils');

/**
 * Creates a transport bound to a Server
 *  @param {Server} server Server instance
 *  @return {Function}
 *  @api public
 */
var Transport = function(server) {
    return function(req, conn) {
        server.call(req, function(error, success) {
            conn.send(error || success);
        });
    };
};

module.exports = Transport;
