var httpReq = require("http")
  , wbResp = require("httpWBFeedback").ProcessFeedback;

///////////////////////////////
// INTERNAL HELPER FUNCTIONS //
///////////////////////////////

 exports.httpRequest = function(command, URLconstruct, commandURL, type) {// feedbackFunction) {

	var options = {
	  hostname: WBUser.HOMEURL,
	  port: WBUser.HOMEPORT,
	  path: URLconstruct + commandURL,
	  //headers: {'Host':WBUser.HOMEURL,'Accept':'*/*','User-Agent':'Mozilla/5.0', 'Connection':'keep-alive'},
	  agent: 'ninjaBrick/1.0',
	  //agent: false,
	  method: type//,
	  //connection: 'keep-alive'
	};

	var bodyData = '';

	//console.log(JSON.stringify(options));
	//console.log("In httpRequest with " + commandURL + " for " + type + " using " + options.hostname + ":" + options.port + '/' + commandURL);

	//var req = httpReq.request(options, processLocalFeedback);

	var processLocalFeedback = function(res) {
	  status = res.statusCode;
	  headers = res.headers;
	  //console.log('STATUS: ' + status);
	  //console.log('HEADERS: ' + JSON.stringify(headers));

	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    bodyData = bodyData + chunk;
	    //console.log('BODY:CHUNK:DATA: ' + status + ':\n' + bodyData);
	    });

	  res.on('end', function() {
	    //console.log('BODY:END:DATA: ' + status + ':\n' + bodyData);	    
	  	//ProcessFeedback(status, headers, type, command, bodyData);
	  	wbResp(status, headers, type, command, bodyData);
	    });
	
	};

	var req = httpReq.request(options, processLocalFeedback);//.end();

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	req.end();

};
