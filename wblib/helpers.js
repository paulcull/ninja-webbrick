var util = require('util');
var XRegExp = require("xregexp").XRegExp;
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;

function WBError(opts) {
    this.description = opts.description || 'Unkown Error';
    this.type = opts.type || 0;
}
WBError.prototype = new Error;

exports.WBError = WBError;

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

        //this._app.log.debug("xpathWBResponse: Started processing " +  r);
  console.log("xpathWBResponse: Started processing : %s " +  r, xp);
  var _doc = new dom().parseFromString(r);
  console.log("Output from _doc is %s", _doc.toString());
  var output = xpath.select(xp, _doc).toString();
  console.log("Output from xpathWBResponse is %s", output);
  //console.log(_nodes[0].localName + ": " + _nodes[0].firstChild.data);
  ///console.log("node: " + _nodes[0].toString());  
        //this._app.log.debug(_nodes[0].localName + ": " + _nodes[0].firstChild.data);
        //this._app.log.debug("node: " + _nodes[0].toString());  
  return output;//[1];
  
};

exports.regexWBResponse = function(r,m) {

  //this._app.log.debug("regexWBResponse: Started processing " +  r);
  var _regEx = new RegExp(m);
  var output = _regEx.exec(r);
  //this._app.log.debug("regexWBResponse: applied " + _regEx + " and rec'd " + output);//[1]);
  return output;//[1];

};

exports.getValFromResponse = function(response, type) {

  //this._app.log.debug("getValFromResponse: Started processing " +  response);
  if (type == "send") {
    var _regEx = new RegExp("<h2>(.*?)</h2>");
  } else {
    var _regEx = new RegExp("<val>(.*?)</val>");
  }
  var output = _regEx.exec(response);
  //this._app.log.debug("getValFromResponse: applied " + _regEx + " and rec'd " + output);//[1]);
  return output;//[1];

};

exports.getFromTrueOrFalse = function(text) {
  var _return = "0";
  if (text == "True") {
    //console.log("getFromTrueOrFalse: Found True");
    _return = "1";
  }
  //console.log("getFromTrueOrFalse:: Input: " + text + " Output: " + _return);
  return _return;
};

//Get array of boolean from decimal value representation
exports.arrayFromMask = function(nMask) {
  // nMask must be between -2147483648 and 2147483647
  if (nMask > 0x7fffffff || nMask < -0x80000000) { throw new TypeError("arrayFromMask - out of range"); }
  for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
  return aFromMask;
}
