// This isn't used for the Ninja Block Driver
// but I must have done it for some reason,
// so I'm leaving here
// may have been for the 



// var WBUser = require("../conf/WBUser.json")
//   , HttpWB = require("httpHelper")
//   , util = require("util");


// ////////////////////////////////////////
// //
// // This driver is for the polling option
// //
// // Working with the Gateway device
// //
// ////////////////////////////////////////


// ////////////////////////////////////////
// // COMMANDS THAT SET A VALUE DIRECTLY //
// //
// // HEATING 
// //
// ////////////////////////////////////////
// function getCHBoilerState() {
// 	console.log("Getting CH Brick state");
// 	HttpWB.httpRequest("boiler:heating:getCHBoilerState" , 
// 		'wbsts/',
// 		WBUser.Bricks['heating'] + '/DO/0', 
// 		'GET'
// 		);
// 	//  host:port/wbsts/5/DO/0
// }

// function getRoomHeatingState(room) {
// if (WBUser.Zones[room.toLowerCase()] !== undefined) {
// 		console.log("Getting Room Heating state for "+ WBUser.Zones[room.toLowerCase()]);
// 		HttpWB.httpRequest("heating:" + room + ":getRoomHeatingState" , 
// 			'eventstate/',
// 			WBUser.Zones[room.toLowerCase()] +  '/state?attr=status', 
// 			'GET'
// 			);
// 	} else {
// 		console.log("getRoomHeatingState: Invalid Input Zone "+ room);
// 	}
// }

// function getRoomHeatingTarget(room) {
// if (WBUser.Zones[room.toLowerCase()] !== undefined) {
// 		console.log("Getting Room Heating target for "+ WBUser.Zones[room.toLowerCase()]);
// 		HttpWB.httpRequest("heating:" + room + ":getRoomHeatingTarget" , 
// 			'eventstate/',
// 			WBUser.Zones[room.toLowerCase()] +  '/state?attr=targetsetpoint', 
// 			'GET'
// 			);
// 	} else {
// 		console.log("getRoomHeatingTarget: Invalid Input Zone " + room);
// 	}
// }
// function setRoomHeatingTarget(room, target) {

// if (WBUser.Zones[room.toLowerCase()] !== undefined) {
// 		console.log("Setting Room Heating target for "+ WBUser.Zones[room.toLowerCase()]);
// 		HttpWB.httpRequest("heating:" + room + ":setRoomHeatingTarget" , 
// 			'eventstate/',
// 			WBUser.Zones[room.toLowerCase()] +  'manual/set?type=http://id.webbrick.co.uk/events/zones/manual&val=' +  target, 
// 			'GET'
// 			);
// //		setTimeout(WBDriver.getRoomHeatingTarget(room),1000);
// //		setTimeout(WBDriver.getRoomHeatingState(room),1000);
// //		setTimeout(WBDriver.getCHBoilerState(),1000);
// 	} else {
// 		console.log("setRoomHeatingTarget: Invalid Input Zone " + room);
// 	}
// }

// ////////////////////////////////////////
// // COMMANDS THAT SET A VALUE DIRECTLY //
// //
// // TEMPERATURE
// //
// ////////////////////////////////////////
// function getRoomTemp(room) {
// if (WBUser.Zones[room.toLowerCase()] !== undefined) {
// 		console.log("Getting Room temp for "+ WBUser.Zones[room.toLowerCase()]);
// 		HttpWB.httpRequest("temp:" + room + ":getRoomTemp" , 
// 			'eventstate/',
// 			WBUser.Zones[room.toLowerCase()] +  '/state?attr=zoneTemp', 
// 			'GET'
// 			);

// 	} else {
// 		console.log("getRoomTemp: Invalid Input Zone " + room);
// 	}
// }

// ////////////////////////////////////////
// //
// // Info
// //
// ////////////////////////////////////////
// function getDayPhase() {
// 	console.log("Getting info temp for day phase");
// 	HttpWB.httpRequest("info:dayphase" + ":getDayPhase" , 
// 		'eventstate/',
// 		'time/dayphaseext?attr=dayphasetext', 
// 		'GET'
// 		);
// }
// function getOccupants() {
// 	console.log("Getting info for occupants");
// 	HttpWB.httpRequest("info:occupants" + ":getOccupants" , 
// 		'eventstate/',
// 		'occupants/home', 
// 		'GET'
// 		);
// }
// function getEarlyStart() {
// 	console.log("Getting info for early start");
// 	HttpWB.httpRequest("info:earlystart" + ":getEarlyStart" , 
// 		'eventstate/',
// 		'earlyStart/enabled', 
// 		'GET'
// 		);
// }

// ////////////////////////////////////////
// // COMMANDS THAT SET A VALUE DIRECTLY //
// //
// // HOT WATER
// //
// ////////////////////////////////////////
// function getHWState() {
// 	console.log("Getting HW state");
// 	HttpWB.httpRequest("heating:hotwater:getHWState", 
// 		'eventstate/',
// 		'zone1/state?attr=status', 
// 		'GET'
// 		);
// }
// function getHWBoilerState() {
// 	console.log("Getting HW state");
// 	HttpWB.httpRequest("boiler:hotwater:getHWBoilerState" , 
// 		'wbsts/', 
// 		WBUser.Bricks['heating'] + '/DO/1', 
// 		'GET'
// 		);
// }
// function getHWTarget() {
// 	console.log("Getting HW target");
// 	HttpWB.httpRequest("heating:hotwater:getHWTarget", 
// 		'eventstate/',
// 		'zone1/state?attr=targetsetpoint', 
// 		'GET'
// 		);
// }
// function setHWTarget(target) {
// 	console.log("Setting HW target");
// 	HttpWB.httpRequest("heating:hotwater:setHWTarget", 
// 		'eventstate/',
// 		'zone1/manual/set?type=http://id.webbrick.co.uk/events/zones/manual&val=' + target, 
// 		'GET'
// 		);
// 	//setTimeout(WBDriver.getHWBoilerState(),1000);
// }
// function setHWOff() {
// 	console.log("Force HW Off");
// 	HttpWB.httpRequest("heating:hotwater:setHWOff:2", 
// 		'eventstate/',
// 		'zone1/manual/set?type=http://id.webbrick.co.uk/events/zones/manual&val=2', 
// 		'GET'
// 		);
// 	//setTimeout(WBDriver.getHWBoilerState(),1000);
// }
// function setHWOn() {
// 	console.log("Force HW On");
// 	HttpWB.httpRequest("heating:hotwater:setHWOn:85", 
// 		'eventstate/',
// 		'zone1/manual/set?type=http://id.webbrick.co.uk/events/zones/manual&val=85', 
// 		'GET'
// 		);
// 	//setTimeout(WBDriver.getHWBoilerState(),1000);
// }

// /////////////////////////////////////////////////
// // Lighting
// // light:breakfastroom:main:setRoomLightLevel:85
// /////////////////////////////////////////////////

// function getRoomLightLevel(room, roomarea) {
// 	console.log("Getting Room light level for "+ room + " area " + roomarea);
// 	HttpWB.httpRequest("light:"+ room + ":" + roomarea + ":getRoomLightLevel", 
// 		'eventstate/',
// 		'to_ui/'+ room +'/lighting/' + roomarea + '/level?attr=val', 
// 		'GET'
// 		);
// }
// function setRoomLightLevel(room, roomarea, target) {
// 	console.log("Setting Room light level for  "+ room + " area " + roomarea);
// 	HttpWB.httpRequest("light:"+ room + ":" + roomarea + ":setRoomLightLevel", 
// 		'eventstate/',
// 		'from_ui/'+ room +'/lighting/'+ roomarea +'/level?val='+  target, 
// 		'GET'
// 		);
// }

// /////////////////////////////////////////////////
// // Room Active Status
// // active:breakfastroom:main
// /////////////////////////////////////////////////

// function getRoomActiveState(room) {
// 	console.log("Getting Room active state for " + room);
// 	HttpWB.httpRequest("active:"+ room , 
// 		'wbsts/', 
// 		WBUser.Bricks[room.toLowerCase()] + '/DO/' + WBUser.ActiveStateSensor[room.toLowerCase()], 
// 		'GET'
// 		);
// }


// exports.getRoomTemp = getRoomTemp;
// exports.getRoomLightLevel = getRoomLightLevel;
// exports.getRoomActiveState = getRoomActiveState;
// exports.getHWState = getHWState;
// exports.getHWBoilerState = getHWBoilerState;
// exports.getCHBoilerState = getCHBoilerState;
// exports.getOccupants = getOccupants;

// console.log("Initialised WBDriver");


