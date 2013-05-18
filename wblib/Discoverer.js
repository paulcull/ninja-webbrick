// Took discover out, as I need to know much more
// details about the individual devices to setup the NB
// left here as an example of a UDP searcher
// probably rubbish, and I'll look back and think
// that it would never have worked, but thats life

// var dgram = require('dgram');
// var async = require('async');
// var request = require('request');
// var xml = require('libxml-to-js');
// var url = require('url');
// var helper = require('./helpers');

// module.exports = function(runUDPPort, cb) {

//   console.log("runUDPPort is %s", runUDPPort);
//   if (runUDPPort ===  '') 
//     {
//       var found = [];
//       console.log('fixed brick addresses');
//       found.push("192.168.1.243"
//                 ,"192.168.1.244"
//                 ,"192.168.1.245"
//                 ,"192.168.1.246"
//                 ,"192.168.1.247"
//                 ,"192.168.1.248"
//                 ,"192.168.1.249"
//                 ,"192.168.1.250"
//                 );

//       async.map(found,WBFinder,function(err,results) {
//         cb(results.filter(function(item,index,arr) {
//           return item;
//         }));
//       });
//     } 
//     else 
//     {
//       console.log("Creating listening server on port %s", runUDPPort);
//       createServer(runUDPPort,cb);

//     }

// };

// function createServer(port,cb) {

//   var server = dgram.createSocket("udp4");
//   var found = [];

//   console.log("Setting up server on port %s...",port);
// //  console.log(JSON.stringify(found));

//   server.on("message", function (msg, rinfo) {
// //  console.log("From: " + rinfo.address + ":" + rinfo.port);

//     fullMsg = helper.UDPMessage(msg,rinfo);
//     console.log('back in server...');
//     // if (found.indexOf(rinfo.address)===-1) {
//     //   console.log("adding "+rinfo.address);
//     //   found.push(rinfo.address); 
//     // }

//   });

//   server.bind(port);

//   var handleSearchResults = function(){

    
// //    console.log(JSON.stringify(found));
//      //async.map(found,WBFinder,function(err,results) {
//        // cb(results.filter(function(item,index,arr) {
//        //   return item;
//        // }));
//       console.log('Closing Server...');
//       server.close();
//     //});
//   };

//   setTimeout(handleSearchResults,6000);
// };

// function WBFinder(brick,cb) {

//     console.log("in WBFinder...");
//     console.log(JSON.stringify(brick));
  
//   //   var opts = {
//   //     method:'GET',
//   //     url:'http://'+brick+'/WbStatus.xml',
//   //     json:{on:false},
//   //     timeout:300
//   //   };

//   // request(opts,function(e,r,b) {
//   //       //console.log(b);

//   //   xml(b, function (error, result) {
//   //       if (error) {
//   //         return cb(error);
//   //       }
//   //       else if (/WebbrickStatus/g.test(b)) {
//   //         return cb (null,{location:url.parse(brick),info:result});
//   //       } else {
//   //         return cb(true);
//   //       }
//   //   });

//   // });

// };