var dgram = require('dgram');
var async = require('async');
var request = require('request');
var xml = require('libxml-to-js');
var url = require('url');

module.exports = function(runUDPPort, cb) {

  console.log("runUDPPort is %s", runUDPPort);
  if (runUDPPort ===  '') 
    {
      var found = [];
 
      found.push("192.168.1.243"
                ,"192.168.1.244"
                ,"192.168.1.245"
                ,"192.168.1.246"
                ,"192.168.1.247"
                ,"192.168.1.248"
                ,"192.168.1.249"
                ,"192.168.1.250"
                );

      async.map(found,WBFinder,function(err,results) {
        cb(results.filter(function(item,index,arr) {
          return item;
        }));
      });
    } 
    else 
    {
    //  var client = dgram.createSocket("udp4");
    //  var message = new Buffer(packet);
    //  console.log("in discover...");
    //  client.bind();
    //  createServer(client.address().port,cb);
      console.log("Creating listening server on port %s", runUDPPort);
      createServer(runUDPPort,cb);
    //  console.log("Sending message...");
    //  client.send(message, 0, message.length, 2552, "239.255.255.250",function() {
    //    console.log("send back...");
    //   client.close();
    //  });
    }

};

function createServer(port,cb) {

  var server = dgram.createSocket("udp4");
  var found = [];


  console.log("Setting up server...");
  console.log(JSON.stringify(found));

  server.on("message", function (msg, rinfo) {
  console.log("From: " + rinfo.address + ":" + rinfo.port);

    if (found.indexOf(rinfo.address)===-1) {
      console.log("adding "+rinfo.address);
      console.log(JSON.stringify(msg));
      console.log(JSON.stringify(rinfo));
      found.push(rinfo.address); 

    }

  });

  server.bind(port);

  var handleSearchResults = function(){

    
    console.log(JSON.stringify(found));
     async.map(found,WBFinder,function(err,results) {
       cb(results.filter(function(item,index,arr) {
         return item;
       }));
      server.close();
    });
  };

  setTimeout(handleSearchResults,60000);
};

function WBFinder(brick,cb) {

    console.log("in WBFinder...");
    console.log(JSON.stringify(brick));
  
  //   var opts = {
  //     method:'GET',
  //     url:'http://'+brick+'/WbStatus.xml',
  //     json:{on:false},
  //     timeout:300
  //   };

  // request(opts,function(e,r,b) {
  //       //console.log(b);

  //   xml(b, function (error, result) {
  //       if (error) {
  //         return cb(error);
  //       }
  //       else if (/WebbrickStatus/g.test(b)) {
  //         return cb (null,{location:url.parse(brick),info:result});
  //       } else {
  //         return cb(true);
  //       }
  //   });

  // });

};