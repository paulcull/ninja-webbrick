var Helpers = require("./helpers");


exports.ProcessFeedback = function(status, headers, type, command, body) {

if (status == 200) {
	// extract information from body here
	// console.log("Request succeeded (HTTP 200 OK). status received: " + status + ' for ' + command);
	// console.log("Request succeeded (HTTP 200 OK). headers received: " + JSON.stringify(headers));
	// console.log("Request succeeded (HTTP 200 OK). type: " + type);
	// console.log("Request succeeded (HTTP 200 OK). command: " + command);
	if (type == "send") {
			//console.log("Request succeeded (HTTP 200 OK). Body received: " + body);
		}
	} else {
		// an error occurred, display the returned status code
		console.log("Error: returned status code " + status);
		return;
	}


	// Get message sets
	var commandDetails	=command.split(":");
	var _functype		=commandDetails[0];
	var _room			=commandDetails[1];  // also used for the info type to show the information 
	var _roomarea		="main";
	var _codeFnPos		=2;
	var _target			="n/a";
	
	if (_functype == "light") {
		_roomarea    	= commandDetails[2];
		_codeFnPos   	= 3;
	}
	var _codefunction   = commandDetails[_codeFnPos];
	if (type == "send") {
		_target 		= commandDetails[_codeFnPos+1];
	} 
	var value 			= Helpers.getValFromResponse(body,type)[1];

	var answers = {
	  houseFunction: _functype,
	  room: _room,
	  roomarea: _roomarea,
	  hostname: WBUser.HOMEURL,
	  value: '',
	  target: _target,
	  port: WBUser.HOMEPORT,
	  path: command,	  
	  method: type
	};

	switch (_functype) {
		// START Boiler
		case "boiler":
			//var _join = WBUser.JoinNames[_functype + ':' + _room];
			var _value = parseInt(Helpers.getFromTrueOrFalse(value),10);
			//
			//console.log("Boiler: " + commandDetails + ' : ' + _value);// + ' to d' + _join);
			//CF.setJoin("d" + _join, _value);
			break;
		// END Boiler

		// START heating
		case "heating":
			//var _join = WBUser.JoinNames[_functype + ':' + _room];
			var _value = parseInt(WBUser.HeatingState[value.toLowerCase()],10);
			//
			//console.log("Heating: " + commandDetails + ' : ' + _value);// + ' to d' + _join);
			//CF.setJoin("d" + _join, _value);	
			break;
		// END Heating

		// START Temperatures
		case "temp":
			//var _join = WBUser.JoinNames[_functype + ':' + _room];
			//var _join2 = (parseInt(WBUser.JoinNames[_functype + ':' + _room])+1000);
			//var _value = (((15 + parseInt(value,10))/55)*65534);
			//
			//console.log("Temperatures: " + commandDetails + ' : ' + value + '(' + _value + ')');// to ' + _join + " and s" + _join2 + " to " + value);
			console.log("Temperatures: " + commandDetails + ' : ' + value );//+ '(' + _value + ')');
			answers.value = value;
			//CF.setJoin("a" + _join, _value);
			//CF.setJoin("s" + _join2, value);
			break;
		// END Temperatures

		// START Active State
		case "active":
			//var _join = WBUser.JoinNames[_functype + ':' + _room];
			var _value = parseInt(Helpers.getFromTrueOrFalse(value),10);
			//
			//console.log("Active State: " + commandDetails + ' : ' + value + '(' + _value + ')');//' to ' + _join + " to " + value);
			//CF.setJoin("d" + _join, _value);
			break;
		// END Active State


		// Lighting
		case "light":
			//var _join = WBUser.JoinNames[_functype + ':' + _room + ':' + _roomarea];
			//var _join2 = (parseInt(WBUser.JoinNames[_functype + ':' + _room + ':' + _roomarea])+1000);
			var _value = (parseInt(((value/100*90)+5),10) * 655 );
			var _num_target = (parseInt(((value/100*90)+5),10) * 655 );
			//
			//console.log("Light: " + commandDetails + ' : ' + value + '(' + _value + ')');//' to a' + _join + " and s" + _join2 + " to " + value);
			if (type == "send") {
				//CF.setJoin("a" + _join, _num_target);
				//CF.setJoin("s" + _join2, _target);
			} else {
				//CF.setJoin("a" + _join, _value);
				//CF.setJoin("s" + _join2, value);
			}
			break;
		// END Lighting

		// Information
		case "info":
			//var _join = WBUser.JoinNames[_functype + ':' + _room];
			//
			//console.log("Light: " + commandDetails + ' : ' + value );//+ ' to s' + _join);
			//CF.setJoin("s" + _join, value);
			break;
		// END Information

		// DEFAULT UNCAUGHT RETURN VALUE
		default:
			console.log("Uncaught Return " + command);
			console.log("Uncaught Response " + body);
			break;
		// END DEFAULT
	}

	console.log("Answers" + '\n' + JSON.stringify(answers));
};
