var PythSh = require('python-shell');

//module.exports.accessory = NutAccessory;
//module.exports.platform = NutPlatform;

var Service, Characteristic;

module.exports = function(homebridge) {
  console.log("homebridge API version: " + homebridge.version);
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerPlatform("homebridge-Irrigation", "Irrigaion", IrrigationPlatform);
};

function IrrigationPlatform(log, config){
	this.config = config;
	this.log = log;
	this.log("Starting Irrigation Platform");
	this.accessories = [];
	this.valves = ('valves' in config ? config.valves : []);

	// We know all the valves from the config, so we can create them now
	for (let i = 0; i < this.valves.length; i++) {
		this.accessories.push(new ValveAccessory(this.log, this.valves[i]));
	}
};

IrrigationPlatform.prototype = {
};

function ValveAccessory(log, config){
	this.config = config;
	this.log = log;
	this.log("Creating Valve Accessory: " + config.name);
	this.name = config.name;
	this.GPIO_pin = config.pin;
	this.outputState = false;
};

ValveAccessory.prototype = {
	setOn: function (value, callback){
    this.log("setOn :" , value);

    var options = {
      scriptPath: '/home/pi/homebridge-plugins/homebridge-Irrigation/python-scripts',
      args: this.GPIO_pin
    };

    if(value) {
    	PythSh.PythonShell.run('stationOn.py', options, function (err, results) {
	        if (err) {
	            this.log("Script Error", options.scriptPath, options.args, err);
	            if(callback) callback(err);
	        } else {
	            // results is an array consisting of messages collected during execution
	            this.log('%j', results);
	            this.outputState = value;

	            this.log("outputState is now %s", this.outputState);
	            if(callback) callback(null, value); // success
	        }
    	}.bind(this));
    } else {
    	PythSh.PythonShell.run('stationOff.py', options, function (err, results) {
	        if (err) {
	            this.log("Script Error", options.scriptPath, options.args, err);
	            if(callback) callback(err);
	        } else {
	            // results is an array consisting of messages collected during execution
	            this.log('%j', results);
	            this.outputState = value;

	            this.log("outputState is now %s", this.outputState);
	            if(callback) callback(null, value); // success
	        }
      	}.bind(this));
    }
  },

  getOn: function (callback) {
    this.log("getOn called");
    callback(null, this.outputState);
  },

  getServices: function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Seth Norris")
      .setCharacteristic(Characteristic.Model, "Irrigation Valve")
      .setCharacteristic(Characteristic.SerialNumber, "1111");

    let valveService = new Service.Switch(this.name);
    valveService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));

    this.informationService = informationService;
    this.valveService = valveService;
    return [informationService, valveService];
  }
};