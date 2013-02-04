var util = require('util')
  , stream = require('stream')
  , os = require('os')
//  , helpers = require('./lib/helpers')
//  , Hue = require('hue.js')
//  , Light = require('./lib/Light');
  , bricks = require('./conf/WBUser')
//  , WB = require('./lib/WBDriver');
  , WB = require('webbrick.js');

util.inherits(WB,stream);
module.exports = wb;

function wb(opts,app) {

  var self = this;

  this._app = app;
  this._opts = opts;
  this._opts.bricks = opts.bricks || [];

  console.log(this._app)
  console.log(this._opts)

  // Todo: use node ID
  this.appName = 'Webbrick Ninja Module';

  app.on('client::up', function() {
  this._app.log.info('WB: Loading...')

    if (self._opts.bricks.length>0) {
      loadbricks.call(self);
    } else {
      findbricks.call(self);
    }
  });
};

hue.prototype.config = function(config) {
  // Handle config, then
  // this.emit('config')
};

function findbricks() {

  this._app.log.info('WB: No configuration')
  var self = this;

  // If we do not want to auto register
  if (!this._opts.autoRegister) return;

  setInterval(function() {

    webbrick.discover(function(bricks) {
      bricks.forEach(registerbrick.bind(self));
    });
  },20000);
};

function registerbrick(brick) {

  if (this._opts.bricks.indexOf(brick)>-1) {
    // We already have this brick registered.
    this._app.log.info('WB: Already configured WB %s, aborting',brick);
    return;
  }

  var self = this;

  var client = WB.createClient({
    brickIp:brick,
    appName:this.appName
  });

  var registerOpts = {
    interval:2000,
    attempts:0
  };


  self._app.log.info('WB: Please press link button on brick %s',brick);

  client.register(registerOpts,function(err) {

    if (err) {
      // Do nothing?
      self._app.log.info('Timed out waiting for brick')
      return;
    }

    self._app.log.info('WB: brick %s registered, saving',brick);
    self._opts.bricks.push(brick);

    self.save();

    loadbricks.call(self);
  });
};

function loadbricks() {

  this._opts.bricks.forEach(fetchLights.bind(this));
};

function fetchLights(brick,brickIndex) {

  var self = this;

  var client = Hue.createClient({
    brickIp:brick,
    appName:this.appName
  });

  client.lights(function(err,lights) {

    if (err) {
      // TODO check we are registered
      self.app.log.error(err);
      return;
    }

    Object.keys(lights).forEach(function(lightIndex) {

      self.emit('register',new Light(client,brickIndex,lightIndex))
    });
  });
};
