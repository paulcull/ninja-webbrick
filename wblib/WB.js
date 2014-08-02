var util         = require('util')
  , request      = require('request')
  , EventEmitter = require('events').EventEmitter
  , Helpers      = require('./helpers.js')
  , xml          = require('libxml-to-js')
  , wbu          = require('../conf/WBUser.json');


module.exports = WB;
//util.inherits(WB,EventEmitter);

//function WB(config,app,connPool) {
function WB(config,logger,connPool) {
  //EventEmitter.call(this);
  if (!config.brickIp)
    throw new Error('Brick IP is required');

  var self = this;

  this._logger = logger;
  //this._app = app;
  this._brick = config.brickIp;
  this._channel = config.channel;
  this._config = config;
  this._key = '';
  this._authenticated = false;
  this._zone = config.zoneName;
  this._zoneArea = config.zoneArea;
  this._connPool = connPool;


};

// This isn't working polling the web bricks each time for each device.
// It's blowing up the siteplayer chip and they're crashing
// change the reads to read from the gateway box, but keep 
// changes to the devices to be posted directly to the bricks themselves
// a shame 

WB.prototype.tempState = function(ch,cb) {

  var self = this;
  if (1<ch>5) throw new Error('Temperature channel must be between 1 and 5 inclusive');

  this._logger.debug('(Webbrick) Requesting connection for %s from pool: %s : [%s out of %s] %s waiting',this._config.G,this._connPool.getName(),this._connPool.availableObjectsCount(),this._connPool.getPoolSize(),this._connPool.waitingClientsCount());
  this._connPool.acquire(function(err,client) {
    
    if (err) {var errmsg = new Error('request body is undefined error: %s', b);};
    self._logger.debug('Recieved connection for %s from pool: %s : [%s out of %s] %s waiting',self._config.G,self._connPool.getName(),self._connPool.availableObjectsCount(),self._connPool.getPoolSize(),self._connPool.waitingClientsCount());

    client.url = 'http://' + wbu.HOMEURL + ':' + wbu.HOMEPORT + '/eventstate/' + wbu.Zones[self._zone.toLowerCase()] + '/state?attr=zoneTemp', 
    request(client,function(e,r,b) {
      if (e) {
        cb(e)
        //self._logger.debug('Request Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
        self._connPool.release(client);
      }
      else if (typeof cb === "function") {
        if (typeof b != 'undefined') {
          xml(b, function (error, result) {
            if (error) {
              //console.log('XML parse error');
              //self._logger.debug('XML Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
              self._connPool.release(client);
              return cb(error);
            } else if (/val/g.test(b)) {
              //console.log(result.val);
              //self._logger.debug('Complete Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
              self._connPool.release(client);
              return cb(false,result.val);
            }
          });
        } else {
        var errmsg = new Error('request body is undefined error: %s', b);
        //self._logger.debug('Undefined Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
        self._connPool.release(client);
        return cb(errmsg);
        }
      }
    });
    return this;
  });

}

WB.prototype.createHeart = function(ch,cb) {
  return cb(false,'awaiting heartbeat...');
}

WB.prototype.createCommand = function(ch,cb) {
  return cb(false,'awaiting command...');
}


WB.prototype.createState = function(ch,cb) {
  return cb(false,null);
}

WB.prototype.dimmerState = function(ch,cb) {

  var self = this;
  if (0<ch>3) throw new Error('Dimmer channel must be between 1 and 4 inclusive');

  this._logger.debug('(Webbrick) Requesting connection for %s from pool: %s : [%s out of %s] %s waiting',this._config.G,this._connPool.getName(),this._connPool.availableObjectsCount(),this._connPool.getPoolSize(),this._connPool.waitingClientsCount());
  this._connPool.acquire(function(err,client) {
    
    if (err) {var errmsg = new Error('request body is undefined error: %s', b);};
    //self._logger.debug('Recieved connection for %s from pool: %s : [%s out of %s] %s waiting',self._config.G,self._connPool.getName(),self._connPool.availableObjectsCount(),self._connPool.getPoolSize(),self._connPool.waitingClientsCount());

    client.url = 'http://' + wbu.HOMEURL + ':' + wbu.HOMEPORT + '/eventstate/to_ui/'+ self._zone.toLowerCase() +'/lighting/' + self._zoneArea.toLowerCase()  + '/level?attr=val', 

    request(client,function(e,r,b) {
      if (e) {
        cb(e)
        //self._logger.debug('Request Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
        self._connPool.release(client);
      }
      else if (typeof cb === "function") {
        if (typeof b != 'undefined') {
          xml(b, function (error, result) {
            if (error) {
              //console.log('XML parse error');
              //self._logger.debug('XML Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
              self._connPool.release(client);
              return cb(error);
            } else if (/err/g.test(b)) {
                var errmsg = new Error('Error in response from GW: %s', result.err);
                //self._logger.debug('Content Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
                self._connPool.release(client);
                return cb(errmsg);            
            } else if (/val/g.test(b)) {
              //console.log(result.val);
              //self._logger.debug('Complete Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
              self._connPool.release(client);
              return cb(false,result.val);
            }
          });
        } else {
        var errmsg = new Error('request body is undefined error: %s', b);
        //self._logger.debug('Undefined Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
        self._connPool.release(client);
        return cb(errmsg);
        }
      }
    });
    return this;
  });

}

WB.prototype.pirState = function(ch,cb) {

  var self = this;
  if (0<ch>3) throw new Error('Pir channel must be between 1 and 4 inclusive');

  var opts = {
    method:'GET',
    url:'http://' + wbu.HOMEURL + ':' + wbu.HOMEPORT + '/wbsts/' + wbu.Bricks[room.toLowerCase()] + '/DO/' + wbu.ActiveStateSensor[room.toLowerCase()], 
    json:{on:false},
    timeout:10000
  };

  this._logger.debug('(Webbrick) Requesting connection for %s from pool: %s : [%s out of %s] %s waiting',this._config.G,this._connPool.getName(),this._connPool.availableObjectsCount(),this._connPool.getPoolSize(),this._connPool.waitingClientsCount());
  this._connPool.acquire(function(err,client) {
    
    if (err) {var errmsg = new Error('request body is undefined error: %s', b);};
    //self._logger.debug('Recieved connection for %s from pool: %s : [%s out of %s] %s waiting',self._config.G,self._connPool.getName(),self._connPool.availableObjectsCount(),self._connPool.getPoolSize(),self._connPool.waitingClientsCount());

    client.url = 'http://' + wbu.HOMEURL + ':' + wbu.HOMEPORT + '/wbsts/' + wbu.Bricks[room.toLowerCase()] + '/DO/' + wbu.ActiveStateSensor[room.toLowerCase()], 

    request(client,function(e,r,b) {
      if (e) {
        cb(e)
        //self._logger.debug('Request Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
        self._connPool.release(client);
      }
      else if (typeof cb === "function") {
        if (typeof b != 'undefined') {
          xml(b, function (error, result) {
            if (error) {
              //console.log('XML parse error');
              //self._logger.debug('XML Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
              self._connPool.release(client);
              return cb(error);
            } else if (/err/g.test(b)) {
                var errmsg = new Error('Error in response from GW: %s', result.err);
                //self._logger.debug('Content Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
                self._connPool.release(client);
                return cb(errmsg);            
            } else if (/val/g.test(b)) {
              //console.log(result.val);
              //self._logger.debug('Complete Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
              self._connPool.release(client);
              return cb(false,result.val);
            }
          });
        } else {
        var errmsg = new Error('request body is undefined error: %s', b);
        //self._logger.debug('Undefined Error Releasing a connection for %s from pool: %s',self._config.G,self._connPool.getName());
        self._connPool.release(client);
        return cb(errmsg);
        }
      }
    });
    return this;
  });


}


WB.prototype.command = function(cmd,cb) {
  var opts = {
    method:'PUT',
    url:'http://'+this._brick+'/hid.spi?COM='+cmd,
    json:{on:true},
    timeout:3000
  };
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") cb.apply(this,Helpers.parseWBResponse(b));
  });
  return this;
};


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

  console.log('in DI Trigger');
  var opts = {
    method:'GET',
    url:'http://'+this._brick+'/hid.spi?COM=DI'+ch,
    json:{on:false},
    timeout:3000
  };
  console.log('about to request di trigger with opts : %s',JSON.stringify(opts));
  request(opts,function(e,r,b) {
    if (e) cb(e)
    else if (typeof cb === "function") {
      xml(b, function (error, result) {
          if (error) {
            console.log('1: '+error);
            return cb(error);
          }
          else if (/WebbrickStatus/g.test(b)) {
            console.log('2');
            return cb(false,Helpers.arrayFromMask(result.DI)[ch]);
          } else {
            console.log('3');
            return cb(true);
          }
      });
    }
  });
  return this;
}

