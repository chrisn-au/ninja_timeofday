var Device = require('./lib/device')
  , util = require('util')
  , stream = require('stream');


var data = require('./config.json');
// Give our module a stream interface
util.inherits(myModule,stream);

/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default module configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the cloud
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the cloud
 */
function myModule(opts,app) {

  var self = this;
  this.first = true;

  app.on('client::up',function(){

    // The client is now connecte to the cloud
    
    locations = data.config.Locations;
 
    locations.forEach(function (location) {
         self.emit('register', new Device(location)); 
    });
 
  });
};

/**
 * Called when config data is received from the cloud
 * @param  {Object} config Configuration data
 */
myModule.prototype.config = function(config) {

};

// Export it
module.exports = myModule;
