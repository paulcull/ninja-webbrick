var WB = require('./WB');

// TODO auto discover
//exports.discover = require('./Discoverer');
exports.discover = require('../wbexample/udp_server');

exports.createClient = function(wbOpts) {
 return new WB(wbOpts);
};