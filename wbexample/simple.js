var WebBrick = require('../wblib/wb-interface');
    var util = require('util');

var appName = "My Brick Home";
var runUDPPort = 2552; //for running
//var runUDPPort = ''; //for not running
 
WebBrick.discover(runUDPPort,function(Bricks) {
  console.log("back from discovery");
  console.log(JSON.stringify(Bricks));

  Bricks.forEach(function(thisBrick) {

    //console.log(JSON.stringify(thisBrick));
    //console.log('Found brick number %s at %s',thisBrick.info.SN,thisBrick.location.href);
    //console.log(JSON.stringify(thisBrick.info));

    //Temps
    thisBrick.info.Tmps.Tmp.forEach(function(temperature) {
      //console.log('In temp loop number %s',temperature.id);
      //console.log(JSON.stringify(temperature));
      var wbOpts = {
        "brickIp":thisBrick.location.href,
        "appName":appName,
        "channel":temperature['@'].id
      };
      //console.log(JSON.stringify(wbOpts));
      //console.log(JSON.stringify(temperature['@']));
      var client = WebBrick.createClient(wbOpts);
      client.tempState(temperature['@']['id'],function(err,value) {
        //console.log(JSON.stringify(value));
        if (value != 0) {
          console.log('Temp for %s : %s is %s degrees C.',thisBrick.info.SN, temperature['@']['id'], value);
        }
      });
    });

    //Dimmers
    thisBrick.info.AOs.AO.forEach(function(dimmer) {
      //console.log('In dimmer loop number %s',dimmer.id);
      //console.log(JSON.stringify(dimmer));
      var wbOpts = {
        "brickIp":thisBrick.location.href,
        "appName":appName,
        "channel":dimmer['@'].id
      };
      //console.log(JSON.stringify(wbOpts));
      //console.log(JSON.stringify(dimmer['@']));
      var client = WebBrick.createClient(wbOpts);
      client.dimmerState(dimmer['@']['id'],function(err,value) {
        //console.log(JSON.stringify(value));
        //if (value != 0) {
          console.log('Dimmer for %s : %s is %s%.',thisBrick.info.SN, dimmer['@']['id'], value);
        //}
      });

    });

    //Dig In
    var wbOpts = {
      "brickIp":thisBrick.location.href,
      "appName":appName,
      "channel":1
    };
    //console.log(JSON.stringify(wbOpts));
    var client = WebBrick.createClient(wbOpts);
    client.DigInState('1',function(err,value) {
      //console.log(JSON.stringify(value));
      //if (value != 0) {
        console.log('digIn for %s is %s%.',thisBrick.info.SN, value);
      //}
    });

  });

  //client.dimmerOff();

});




// hue.lights(function(lights) {
//     Object.keys(lights).forEach(function(l) {
//         hue.on()
//         // hue.rgb(l,20,150,66);
//     });
// });