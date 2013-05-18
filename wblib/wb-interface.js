var WB = require('./WB');

// TODO auto discover - See discover library
// exports.discover = require('./Discoverer');
exports.listen = require('./UDPServer');

exports.createClient = function(wbOpts) {
 return new WB(wbOpts);
};