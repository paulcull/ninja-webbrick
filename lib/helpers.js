var XRegExp = require("xregexp").XRegExp;


/////////////////////////////////////////////////

///////////////////////////////
// response extractors       //
///////////////////////////////

exports.getValFromResponse = function(response, type) {
  console.log("getValFromResponse: Started processing " +  response);
  var _regEx = "(.*?)";
  if (type == "send") {
    _regEx = new RegExp("<h2>(.*?)</h2>");
  } else {
    _regEx = new RegExp("<val>(.*?)</val>");
  }
  //var output = response.exec(_regEx);
  var output = _regEx.exec(response);
  //console.log("getValFromResponse: applied " + _regEx + " and rec'd " + output);//[1]);
  //CF.setJoin("s220", type + ' : ' + output[1]);
  //_regEx === null;
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
