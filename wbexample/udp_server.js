var dgram = require('dgram');
var async = require('async');
var request = require('request');

var packet = [
  'M-SEARCH * HTTP/1.1',
  'HOST:239.255.255.250:2552',
  'MAN:"ssdp:discover"',
  'ST:ssdp:all',
  'MX:1',
  ''
].join('\r\n');

module.exports = function(cb) {

  var client = dgram.createSocket("udp4");
  var message = new Buffer(packet);

  client.bind();
//  createServer(client.address().port,cb);
  createServer(2552,cb);
  console.log('server up')
   client.send(message, 0, message.length, 2552, "239.255.255.250",function() {
     client.close();
   });
};

function createServer(port,cb) {

  var server = dgram.createSocket("udp4");
  var found = [];
  	console.log('server up on %s', port);

  server.on("message", function (msg, rinfo) {
  	console.log('message recd');
    if (found.indexOf(rinfo.address)===-1) {
      found.push(rinfo.address);
    }
  });
  server.bind(port);

  setTimeout(function(){

    server.close();
    async.filter(found,hueFinder,cb);
  },20000);
};

function hueFinder(server,cb) {

  console.log(server);
  cb(server);
  //request('http://'+server+'/description.xml',function(e,r,b) {

//    cb(/Philips hue bridge/g.test(b))
//    cb(server)
//  });
};