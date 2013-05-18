var dgram = require('dgram');
var helper = require('./helpers');
var stream = require('stream')
  , util = require('util');

// Give our device a stream interface
util.inherits(WBListener,stream);

module.exports = WBListener;

function WBListener(port,devs,cb) {

  var server = dgram.createSocket("udp4");
  this.server = server;

  server.on("message", function (msg, rinfo) {
    fullMsg = helper.UDPMessage(msg,rinfo);
    //console.log('server Msg: %s',JSON.stringify(fullMsg));
    if (fullMsg.ProcessMsg) {cb(fullMsg)};
  });

  server.bind(port);
  
  var handleSearchResults = function(){
      console.log('UDP Server Error - Closing Server...');
      server.close();
  };

  server.on("error", handleSearchResults);
  //setTimeout(handleSearchResults,6000);
};

WBListener.prototype.stop = function() {
  console.log('Stopping WBListener server...');
  this.server.close();

};