var util         = require('util')
  , request      = require('request')
  , EventEmitter = require('events').EventEmitter
  , Helpers      = require('./helpers.js')
  , xml          = require('libxml-to-js')
  , wbu          = require('../conf/WBUser.json');


module.exports = WB;
//util.inherits(WB,EventEmitter);

function WB(config,app) {
  //EventEmitter.call(this);
  if (!config.brickIp)
    throw new Error('Brick IP is required');

  //var self = this;

  this._app = app;
  this._brick = config.brickIp;
  this._channel = config.channel;
  this._key = '';
  this._authenticated = false;
  this._zone = config.zoneName;
  this._zoneArea = config.zoneArea

};

// This isn't working polling the web bricks each time for each device.
// It's blowing up the siteplayer chip and they're crashing
// change the reads to read from the gateway box, but keep 
// changes to the devices to be posted directly to the bricks themselves
// a shame 

WB.prototype.tempState = function(ch,cb) {

  //var self = this;
  if (1<ch>5) throw new Error('Temperature channel must be between 1 and 5 inclusive');
  var opts = {
    method:'GET',
    url:'http://' + wbu.HOMEURL + ':' + wbu.HOMEPORT + '/eventstate/' + wbu.Zones[this._zone.toLowerCase()] + '/state?attr=zoneTemp', 
    json:{on:true},
    timeout:10000
  };
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") {
      if (typeof b != 'undefined') {
        xml(b, function (error, result) {
            if (error) {
              console.log('XML parse error');
              return cb(error);
            } else if (/val/g.test(b)) {
                  return cb(false,result.val);
            }
        });
      } else {
      var errmsg = new Error('request body is undefined error: %s', b);
      return cb(errmsg);
      }
    }
  });
  return this;
}

WB.prototype.createHeart = function(ch,cb) {
  return cb(false,'awaiting heartbeat...');
}


WB.prototype.createState = function(ch,cb) {
  return cb(false,null);
}

WB.prototype.dimmerState = function(ch,cb) {

  if (0<ch>3) throw new Error('Dimmer channel must be between 1 and 4 inclusive');
  var opts = {
    method:'GET',
    url:'http://' + wbu.HOMEURL + ':' + wbu.HOMEPORT + '/eventstate/to_ui/'+ this._zone.toLowerCase() +'/lighting/' + this._zoneArea.toLowerCase()  + '/level?attr=val', 
    json:{on:false},
    timeout:10000
  };
  request(opts,function(e,r,b) {
  
    if (e) cb(e)
    else if (typeof cb === "function") {
      if (typeof b != 'undefined') {
        xml(b, function (error, result) {
            if (error) {
              return cb(error);
            } else if (/err/g.test(b)) {
                var errmsg = new Error('Error in response from GW: %s', result.err);
                return cb(errmsg);            
            } else if (/val/g.test(b)) {
                  return cb(false,result.val);
            }
        });
      } else {
      var errmsg = new Error('request body is undefined error: %s', b);
      return cb(errmsg);
      }
    }
  });
  return this;
}

WB.prototype.pirState = function(ch,cb) {

  if (0<ch>3) throw new Error('Pir channel must be between 1 and 4 inclusive');
  var opts = {
    method:'GET',
    url:'http://' + wbu.HOMEURL + ':' + wbu.HOMEPORT + '/wbsts/' + wbu.Bricks[room.toLowerCase()] + '/DO/' + wbu.ActiveStateSensor[room.toLowerCase()], 
    json:{on:false},
    timeout:10000
  };
  request(opts,function(e,r,b) {  
    if (e) cb(e)
    else if (typeof cb === "function") {
      if (typeof b != 'undefined') {
        xml(b, function (error, result) {
            if (error) {
              console.log('XML parse error');
              return cb(error);
            } else if (/err/g.test(b)) {
                var errmsg = new Error('Error in response from GW: %s', result.err);
                return cb(errmsg);            
            } else if (/val/g.test(b)) {
                  return cb(false,result.val);
            }
        });
      } else {
      var errmsg = new Error('request body is undefined error: %s', b);
      return cb(errmsg);
      }
    }
  });
  return this;
}


WB.prototype.dimmerOn = function(ch,cb) {
  var opts = {
    method:'PUT',
    url:'http://'+this._brick+'/hid.spi?COM=AA'+ch+';100:',
    json:{on:true},
    timeout:3000
  };
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") cb.apply(this,Helpers.parseWBResponse(b));
  });
  return this;
};

WB.prototype.dimmerLevel = function(ch,lvl,cb) {
  var opts = {
    method:'PUT',
    url:'http://'+this._brick+'/hid.spi?COM=AA'+ch+';'+lvl+':',
    json:{on:true},
    timeout:3000
  };
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") cb.apply(this,Helpers.parseWBResponse(b));
  });
  return this;
};

WB.prototype.dimmerOff = function(ch,cb) {
  var opts = {
    method:'PUT',
    url:'http://'+this._brick+'/hid.spi?COM=AA'+ch+';0:',
    json:{on:false},
    timeout:3000
  };
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") cb.apply(this,Helpers.parseWBResponse(b));
  });
  return this;
};

WB.prototype.DigOutState = function(ch,cb) {

  var opts = {
    method:'GET',
    url:'http://'+this._brick+'/wbstatus.xml',
    json:{on:false},
    timeout:3000
  };
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") {
      xml(b, function (error, result) {
          if (error) {
            return cb(error);
          }
          else if (/WebbrickStatus/g.test(b)) {
            return cb(false,Helpers.arrayFromMask(result.DO)[ch]);
          } else {
            return cb(true);
          }
      });
    }
  });
  return this;
}

WB.prototype.DigInState = function(ch,cb) {

  var opts = {
    method:'GET',
    url:'http://'+this._brick+'/wbstatus.xml',
    json:{on:false},
    timeout:3000
  };
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") {
      xml(b, function (error, result) {
          if (error) {
            return cb(error);
          }
          else if (/WebbrickStatus/g.test(b)) {
            return cb(false,Helpers.arrayFromMask(result.DI)[ch]);
          } else {
            return cb(true);
          }
      });
    }
  });
  return this;
}

WB.prototype.DigInTrigger = function(ch,cb) {

  var opts = {
    method:'GET',
    url:'http://'+this._brick+'/hid.spi?COM=DI'+ch,
    json:{on:false},
    timeout:3000
  };
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") {
      xml(b, function (error, result) {
          if (error) {
            return cb(error);
          }
          else if (/WebbrickStatus/g.test(b)) {
            return cb(false,Helpers.arrayFromMask(result.DI)[ch]);
          } else {
            return cb(true);
          }
      });
    }
  });
  return this;
}

