module.exports.accessory = NutAccessory;
module.exports.platform = NutPlatform;

var Service, Characteristic;

module.exports = function(homebridge) {
  console.log("homebridge API version: " + homebridge.version);
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  //homebridge.registerAccessory("homebridge-relay1", "relay1Test", relay1);
  homebridge.registerPlatform("homebridge-Irrigation", "Irrigaion", IrrigationPlatform);
};

function IrrigationPlatform(log, config){
	this.config = config;
	this.log = log;
	this.log("Starting Irrigation Platform");"
}

IrrigationPlatform.prototype = {
}
