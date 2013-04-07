var Device = require('./lib/device')
  , util = require('util')
  , stream = require('stream')
  , configHandlers = require('./lib/config-handlers')
  , wbds = require('./conf/devices')
  , wb = require('./wblib/WB');

// Give our driver a stream interface
util.inherits(wbDriver,stream);

// Our greeting to the user.
var HELLO_WORLD_ANNOUNCEMENT = {
  "contents": [
    { "type": "heading",      "text": "Ninja Webbrick Driver Loaded" },
    { "type": "paragraph",    "text": "The webbrick driver for ninja blocks has been loaded. You should not see this message again." }
  ]
};
// Our greeting to the user.
var WB_ADDED = {
  "contents": [
    { "type": "heading",      "text": "Ninja Webbrick Added" },
    { "type": "paragraph",    "text": "The webbrick driver for ninja blocks has added a new device." }
  ]
};

var enabled = false;

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
function wbDriver(opts,app) {

  var self = this;
  this._app = app;

  app.on('client::up',function(){

  // The client is now connected to the Ninja Platform

  // Check if we have sent an announcement before.
  // If not, send one and save the fact that we have.
  if (!opts.hasSentAnnouncement) {
    self.emit('announcement',HELLO_WORLD_ANNOUNCEMENT);
    opts.hasSentAnnouncement = true;
    self.save();
  }
  if (enabled) {
      // for each of the devices in the config
      wbds.devices.forEach(function(wbOpts){
        // Register a device
        self._app.log.info('(WebBrick) Found %s WebBrick Device Type %s',wbOpts.deviceName, wbOpts.deviceType);
        self.emit('register', new Device(app, wbOpts));
      });
    }
  });
};

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
wbDriver.prototype.config = function(rpc,cb) {

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

wbDriver.prototype.findStations = function() {
  this._app.log.info('WB: No configuration')
  var self = this;

  // If we do not want to auto register
  if (!this._opts.autoRegister) return;

  wb.discover(function(stations) {
    stations.forEach(function(station) {
      self._app.log.info('WB: Station', station);
      // If we have already registered this
      if (self._opts.stations.indexOf(station)>-1) return;

      // If we have already announced this
      // if (self._opts.sentAnnouncements.indexOf(station) > -1) return;

      self.emit('announcement',WB_ANNOUNCEMENT);
      self.save();
      self.registerStation(station);
    });
  });
};

// Export it
module.exports = wbDriver;