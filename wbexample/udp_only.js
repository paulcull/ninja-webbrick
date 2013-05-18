var WB = require('../wblib/wb-interface.js');

var appName = "My App1";
var util = require('util')

WB.listen('2552',function(stations) {
  console.log(JSON.stringify(stations));
  stations.forEach(fetchLights);
});

function fetchLights(station) {

 console.log(station)
 // var client = Hue.createClient({
 //    stationIp:station,
 //    appName:appName
 //  });

 //  client.lights(function(err,lights) {

 //    if (err && err.type === 1) {
 //      // App has not been registered

 //      console.log("Please go and press the link button on your base station(s)");
 //      client.register(function(err) {

 //        if (err) {
 //          console.error(err);
 //          // Could not register
 //        } else {
 //          console.log("Hue Base Station Paired")
 //          fetchLights(station);
 //          // Registered, carry on
 //        }
 //      });
 //    } else {
 //      console.log(lights);
 //    }
 //  });
};