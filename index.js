'use strict';
var Device = require('./lib/device')
  , util = require('util')
  , stream = require('stream')
  , configHandlers = require('./lib/config-handlers')
  , connectionPool = require('generic-pool')
  , Monitor = require('../ninja-webbrick/wblib/wb-interface')
  , wbHelpers = require('../ninja-webbrick/wblib/helpers');

//Limit Devices to a sample for dev / testing
var wbds = require('./conf/devices');
//var wbds = require('./conf/testdevices');
//var wbds = require('./conf/testdevices_1temp');
//var wbds = {"devices":[]};

// Give our driver a stream interface
util.inherits(nbWebBrick,stream);

// TODO - use config handler
var enabled = true;
var monitor = true;

// Our greeting to the user.
var HELLO_WORLD_ANNOUNCEMENT = {
  "contents": [
    { "type": "heading",      "text": "WebBrick Driver Loaded" },
    { "type": "paragraph",    "text": "The WebBrick driver has been loaded. You should not see this message again." }
  ]
};


/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default driver configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the Ninja Platform
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the Ninja Platform
 */
function nbWebBrick(opts,app) {

//console.log(opts);
//console.log(app);

var self = this;
this._app = app;

  if (!enabled) {
    app.log.info('(WebBrick) WebBrick driver is disabled');
  } else {
    // create a holder for new devices 
    var devCount = 0;
    var devs = [];  
    var brickPool = {};

    app.on('client::up',function(){
      // The client is now connected to the Ninja Platform
      // Check if we have sent an announcement before.
      // If not, send one and save the fact that we have.
      if (!opts.hasSentAnnouncement) {
        self.emit('announcement',HELLO_WORLD_ANNOUNCEMENT);
        opts.hasSentAnnouncement = true;
        self.save();
      }
      // Loop through all the devices in the devices.json file
        self._app.log.info('(WebBrick) Found %s WebBrick Devices',wbds.devices.length);
        wbds.devices.forEach(function(wbOpts){
          // Register a device
          self._app.log.info('(WebBrick) Found %s WebBrick Device Type %s',wbOpts.deviceName, wbOpts.deviceType);
          if (!brickPool[wbOpts.brickIp]) {
            self._app.log.info('Creating new connection pool for webbrick at %s',wbOpts.brickIp);
            var pool = new connectionPool.Pool({
                name     : 'Pool for Brick['+wbOpts.brickIp+']',
                create   : function(callback) {
                    var opts = {};
                    opts.method = 'GET';
                    opts.url = '';//'http://' + wbu.HOMEURL + ':' + wbu.HOMEPORT;
                    opts.json = '{on:true}';
                    opts.timeout = 1000;
                    // parameter order: err, resource
                    callback(null, opts, self._app.log);
                },
                //destroy  : function(client) { console.log('XXXXXXXXX');client = opts; },
                destroy  : function(client) {client.url='';},
                max      : 1,
                refreshIdle : false,
                // specifies how long a resource can stay idle in pool before being removed
                idleTimeoutMillis : 10000,
                // if true, logs via console.log - can also be a function
                 log : false 
            });
            brickPool[wbOpts.brickIp] = pool;
          }
          devs.push(new Device(app.log, wbOpts, brickPool[wbOpts.brickIp]));
          self.emit('register', devs[devCount]);
          //devs[devCount].emit('heartbeat');
          devCount++;
        });
    });

    self._app.log.info('(WebBrick) All registered. Total Device count is %s',devs.length);
  }
  //startup listener if enabled
  if (enabled && monitor) {
    self._app.log.info('(WebBrick) Starting up WebBrick monitor on port %s',2552);
    var UDPListener = new Monitor.listen('2552',devs,function(UDPEvent){
      var devRef = wbHelpers.getDevIndex(devs, UDPEvent.addr, UDPEvent.PacketSource, UDPEvent.SourceChannel, app.id);
        if (devRef != 'error') {
          self._app.log.debug('(Webbrick) set %s at %s to data %s',devs[devRef].wbOpts.deviceType,devs[devRef].guid,JSON.stringify(UDPEvent.data));
          devs[devRef].emit('data',UDPEvent.data);
          } else {
            self._app.log.debug('(Webbrick) couldn\'t find device for UDPEvent: %s',JSON.stringify(UDPEvent));
          }
      });
    this.UDPListener = UDPListener;
  }
}

/**
 * Called when a user prompts a configuration.
 * If `rpc` is null, the user is asking for a menu of actions
 * This menu should have rpc_methods attached to them
 *
 * @param  {Object}   rpc     RPC Object
 * @param  {String}   rpc.method The method from the last payload
 * @param  {Object}   rpc.params Any input data the user provided
 * @param  {Function} cb      Used to match up requests.
 */
nbWebBrick.prototype.config = function(rpc,cb) {

  var self = this;
  // If rpc is null, we should send the user a menu of what he/she
  // can do.
  // Otherwise, we will try action the rpc method
  if (!rpc) {
    return configHandlers.menu.call(this,cb);
  }
  else if (typeof configHandlers[rpc.method] === "function") {
    return configHandlers[rpc.method].call(this,rpc.params,cb);
  }
  else {
    return cb(true);
  }
};


// Export it
module.exports = nbWebBrick;