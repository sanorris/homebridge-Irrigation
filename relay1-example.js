relay1.prototype = {
  setOn: function (value, callback){
    this.log("setOn :" , value);
    var options = {
      scriptPath: '/home/pi/'
    };

        if(value) {
                PythSh.PythonShell.run('relay1_on.py', options, function (err, results) {
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
      PythSh.PythonShell.run('relay1_off.py', options, function (err, results) {
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
      .setCharacteristic(Characteristic.Model, "Relay1 model TBD")
      .setCharacteristic(Characteristic.SerialNumber, "1111");

    let relay1Service = new Service.Switch("Relay1");
    relay1Service
      .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));

    this.informationService = informationService;
    this.relay1Service = relay1Service;
    return [informationService, relay1Service];
  }
};
