var util = require('util');
var XRegExp = require("xregexp").XRegExp;
var devs = require('../conf/devices.json');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;

// function WBError(opts) {
//     this.description = opts.description || 'Unkown Error';
//     this.type = opts.type || 0;
// }
// WBError.prototype = new Error;
// exports.WBError = WBError;

//
//  helper functions and parsers
//

exports.parseWBResponse = function(r) {
    if (util.isArray(r) && r[0].error) {
        return [new WBError(r[0].error)];
    }
    return [null,r];
};
 
exports.xpathWBResponse = function(r,xp) {
  var _doc = new dom().parseFromString(r);
  var output = xpath.select(xp, _doc).toString();
  return output;  
};

exports.regexWBResponse = function(r,m) {
  var _regEx = new RegExp(m);
  var output = _regEx.exec(r);
  return output;
};

exports.getValFromResponse = function(response, type) {
  if (type == "send") {
    var _regEx = new RegExp("<h2>(.*?)</h2>");
  } else {
    var _regEx = new RegExp("<val>(.*?)</val>");
  }
  var output = _regEx.exec(response);
  return output;
};

exports.getFromTrueOrFalse = function(text) {
  var _return = "0";
  if (text == "True") {
    _return = "1";
  }
  return _return;
};


//Get array of boolean from decimal value representation
 function arrayFromMask(nMask) {
  // nMask must be between -2147483648 and 2147483647
  if (nMask > 0x7fffffff || nMask < -0x80000000) { throw new TypeError("arrayFromMask - out of range"); }
  for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
  return aFromMask;
}
// export it, so I can use in and out of the script file
exports.arrayFromMask = arrayFromMask;

//Get NB device ID based on a couple of params
// @devs collection of device ojects
// @IP - IP address
// @DevType - type of device 
// @ch - channel 
exports.getDevIndex = function(devs, IP, DevType, ch, appID) {
  // loop through until found
  var ret = 'error';
    //get last part of the IP address
    var ipParts = IP.split(".");
    var _DevType = DevType;

    switch(DevType) {
      case 'CT':
        var _DevType = 'T';
        var _ch = '0'+(ch+1);        
      break;
      case 'AO':
        var _DevType = 'D';
        var _ch = '0'+ch;
      break;
      case 'DO':
      case 'Do':
        var _DevType = 'DO';
        var _ch = '0'+ch;
      break;
      case 'Ta':
      case 'TA':
      case 'Td':
      case 'TD':
      case 'Tt':
      case 'TT':
      case 'TS':
      case 'TR':
      case 'TX':
        var _DevType = 'DI';
        var _ch = (ch<10) ? '0'+ch : ch;
      break;
      case 'ST':
        var _DevType = 'ST';
        var _ch = '00';
      break;
    }

  for (var d=0;d<devs.length;d++) {
    var tempDev = devs[d];
    var _guid = appID+'_'+ipParts[3]+_DevType+_ch+'_0_'+tempDev.D;
    if (tempDev.guid==_guid) {
      // A9CF56932262E112_246D00_0_224
      ret = d;
      return ret;
    } 
  }
  return ret;
}

//Process UDP buffer response
exports.UDPMessage = function(buffer, rinfo) {
  var encoding = 'ascii';
  var resp = new Object();
  resp.addr = rinfo.address;
  resp.Len = buffer[0];
  resp.PacketType = buffer.toString(encoding, start=1, end=2);
  resp.PacketSource = buffer.toString(encoding, start=2, end=4);
  resp.SourceChannel = buffer[4];
  resp.TargetChannel = buffer[5];
  resp.action = buffer[6];
  // Get action bit array
  resp.actionList = arrayFromMask(buffer[6]);
  resp.FromNodeNo = buffer[7];
  resp.ToNodeNo = buffer[8];
  resp.SetPointNo = buffer[9];
  resp.CurrValH = buffer[10];
  resp.CurrValL = buffer[11];
  // Temp has a bit threshhold flag in 10 to overflow
  resp.TempVal = (buffer[10]==1) ? ((buffer[11]+255)/16): (buffer[11]/16);
  // Only process the events we care about
  resp.ProcessMsg = false;
  // Get time info
  resp.Hour = resp.SourceChannel;
  resp.Minute = resp.TargetChannel;
  resp.Second = resp.action/2;
  resp.Day = resp.FromNodeNo;
  // Summary for the data to send to nb
  resp.data = 0;

  switch (resp.PacketSource) {
    case 'CT':
      resp.ProcessMsg = true;
      resp.data = (resp.PacketSource=='CT') ? resp.TempVal : resp.CurrValH;
      break;
    case 'AO':
      resp.ProcessMsg = true;
      var _data = new Object();
        _data.on = (resp.CurrValL===0) ? false : true;  // its on if brightness > 0
        _data.bri = resp.CurrValL/100*256;
        _data.hue = 0;              
        _data.sat = 0;     
      resp.data = _data;
      break;
    case 'Ta':
    case 'TA':
    case 'Td':
    case 'TD':
    case 'Tt':
    case 'TT':
    case 'TS':
    case 'TR':
    case 'TX':
      resp.ProcessMsg = true;
      resp.data = resp.actionList[0];
      break;
    case 'DO':
    case 'Do':
      resp.ProcessMsg = true;
      resp.data = (resp.action===1) ? 'off' : 'on';
      break;
    case 'ST':
      resp.ProcessMsg = true;
      resp.SourceChannel = null;
      resp.TargetChannel = null;
      resp.action = null;
      resp.ToNodeNo = null;
      resp.SetPointNo = null;
      resp.CurrValL = null;
      resp.CurrValH = null;

      var _data = new Object();
        _data.Hour = resp.Hour;
        _data.Minute = resp.Minute;
        _data.Second = resp.Second;
        _data.Day = resp.Day;
        _data.Format = 'Unit '+_data.Day+' at '+_data.Hour+':'+_data.Minute+':'+_data.Second
      resp.data = _data.Format;
      break;
    }
  return resp;
}
