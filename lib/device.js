var stream = require('stream')
  , util = require('util')
  , WebBrick = require('../../ninja-webbrick/wblib/wb-interface');

// Give our device a stream interface
util.inherits(Device,stream);

// Export it
module.exports=Device;
 
/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the Ninja Platform
 *
 * @fires data - Emit this when you wish to send data to the Ninja Platform
 */
function Device(app, wbOpts) {

  var self = this;
  
  this._app = app;
  this.wbOpts = wbOpts;
  // This device will emit data
  this.readable = wbOpts.readable; // true;
  // This device can be actuated
  this.writeable = wbOpts.writeable; // false;
  //this.deviceType = wbOpts.deviceType
  this.G = 'WBD' + wbOpts.G; // "0"; // G is a string a represents the channel
  this.V = wbOpts.V; // 0;   // 0 is Ninja Blocks' device list
  this.D = wbOpts.D; // 202; // 202 is a generic Ninja Blocks temperature device
  this.name = wbOpts.deviceName; // device shortName

  var wbd = new WebBrick.createClient(wbOpts,app);
  this.wbd = wbd;

  //process.nextTick(function() {
  var timerId = setInterval( function () {

      switch (wbOpts.deviceType) {      
        case "temp":
          wbd.tempState(wbOpts.channel,function(err,value) {
              if (!err) {
                if (value != 0) {
                  self._app.log.debug('(WebBrick) Temp for %s : %s is %s degrees C.',wbOpts.brickIp, wbOpts.channel, JSON.stringify(value));
                  self.emit('name',this.name);
                  self.emit('data',value);
                } else {
                  self._app.log.debug('(WebBrick) Ignoring 0 degrees exactly in get Temp for %s : %s.',wbOpts.brickIp, wbOpts.channel);
                  //self.emit('name',this.name);
                  //self.emit('data','0');
                }
              } else {
                self._app.log.error('(WebBrick) Error in get Temp state for %s : %s. %s',wbOpts.brickIp, wbOpts.channel, err);
                //self.emit('data','0.1');
              }
            });
          break;
        case "pir":
        //do DO state stuff
          wbd.DigOutState(wbOpts.channel,function(err,value) {
              if (!err) {
                self._app.log.debug('(WebBrick) PIR for %s : %s is %s',wbOpts.brickIp, wbOpts.channel, ((value)? 'On' : 'Off'));
                self.emit('data',value);
              } else {
                self._app.log.error('(WebBrick) Error in get PIR state for %s : %s. %s',wbOpts.brickIp, wbOpts.channel, err);
                //self.emit('data','Off');
              }
            });
          break;
        case "state":
        //do DO state stuff
          wbd.DigOutState(wbOpts.channel,function(err,value) {
              if (!err) {
                self._app.log.debug('(WebBrick) PIR for %s : %s is %s',wbOpts.brickIp, wbOpts.channel, ((value)? 'On' : 'Off'));
                self.emit('data',value);
              } else {
                self._app.log.error('(WebBrick) Error in get PIR state for %s : %s. %s',wbOpts.brickIp, wbOpts.channel, err);
                //self.emit('data','Off');
              }
            });
          break;
        case "button":
          //do DO state stuff
          // buttons are write only
          self.emit('data','Off');
          break;          
        case "dimmer":
          wbd.dimmerState(wbOpts.channel,function(err,value) {
              //Create new State object to hold the values for the light protocol
              //brightness is 0-256 in nb. wb is 0-100
              if (!err) {
                var state = new Object();
                state.on = (value===0) ? false : true;  // its on if brightness > 0
                state.bri = value/100*256;
                state.hue = 0;              // only 0 no colour
                state.sat = 0;              // only 0 no colour
                state._wbBri = value;       // original WebBrick value in he response
                var returnData = JSON.stringify(state);
                self._app.log.debug('(WebBrick) Light for %s : %s is %s %.',wbOpts.brickIp, wbOpts.channel, JSON.stringify(value));
                self.emit('data',returnData);
              } else {
                self._app.log.error('(WebBrick) Error in get Dimmer state Light for %s : %s. %s.',wbOpts.brickIp, wbOpts.channel, err);
                // var state = new Object();
                // state.on = false;  // its on if brightness > 0
                // state.bri = 0;
                // state.hue = 0;              // only 0 no colour
                // state.sat = 0;              // only 0 no colour
                // var returnData = JSON.stringify(state);
                // self.emit('data',returnData);
              }
            });
          break;
        case "text":
          wbd.createHeart(wbOpts.channel,function(err,value) {
              if (!err) {
                self._app.log.debug('(WebBrick) Heartbeat for %s : %s is %s',wbOpts.brickIp, wbOpts.channel, value);
                self.emit('data',value);
              } else {
                self._app.log.error('(WebBrick) Error in creating Heartbeat for %s : %s. %s.',wbOpts.brickIp, wbOpts.channel, err);
                //self.emit('data','No Heartbeat');
              }
          });
        default:
              self._app.log.debug('(WebBrick) No Device type controller %s for %s : %s',wbOpts.deviceType, wbOpts.brickIp, wbOpts.channel);
        }


  }, wbOpts.Interval);

};


/**
 * Called whenever there is data from the Ninja Platform
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */
Device.prototype.write = function(data) {

  // I'm being actuated with data!
  var wbd = this.wbd;

  switch (this.deviceType) {      
  case "dimmer":
      //Parse results into object
      try {
        var state = JSON.parse(data);
        var wbBri = (state.bri>0) ? state.bri/256*100 : 0;
      } catch (err) {
        return;
      }
      if (state.bri > 0 && state.on) {
        //only do something if it's on and bright
        this._app.log.debug('(WebBrick) about to set dimmer %s:%s, %s',this.wbOpts.brickIp, this.wbOpts.channel,wbBri);
        wbd.dimmerLevel(this.wbOpts.channel,wbBri,function(err,value) {
          if (err) {
           self._app.log.error('(WebBrick) Error in get set dimmer state on at %s for %s : %s. %s',wbBri, wbOpts.brickIp, wbOpts.channel, err);
          }
          this.emit('data',data)
        });
      } else {
        //switch it off if its 0 or state off
        this._app.log.debug('(WebBrick) about to set dimmer %s:%s off',this.wbOpts.brickIp, this.wbOpts.channel);
        wbd.dimmerLevel(this.wbOpts.channel,0,function(err,value) {
          if (err) {
           self._app.log.error('(WebBrick) Error in get set dimmer state off for %s : %s. %s',wbOpts.brickIp, wbOpts.channel, err);
          }
          this.emit('data',data)
        });        
      }
    break;
  case "button":
      console.log('actuating button');

      this._app.log.debug('(WebBrick) about to push button %s:%s',this.wbOpts.brickIp, this.wbOpts.channel);
        wbd.DigInTrigger(this.wbOpts.channel,function(err,value) {
          if (err) {
           self._app.log.error('(WebBrick) Error in get push button for %s : %s. %s', wbOpts.brickIp, wbOpts.channel, err);
          }
          this.emit('data',data)
        });
    break;
  default:
    throw new Error('(WebBrick) Unsupported Actuator type of %s with data [%s]',this.deviceType,JSON.stringify(data));
    break;
      }
};
