var Device = require('./lib/device')
  , util = require('util')
  , stream = require('stream');


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
  this.opts = opts;
  
  opts.Locations = opts.Locations || new Array(defaultConfig());
//  self.save();

  app.on('client::up',function(){


    if (self.first == true){
    // The client is now connected to the cloud
        opts.Locations.forEach(function (location) {
              self.log.info('Firing up!'); 
              self.emit('register', new Device(location, app)); 
        });
        self.first = false;
    }
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

function defaultConfig()
{
   var day = { "name" : "sunriseEnd" , "display" : "DAY", "offset" : -150 } 
   var dawn = { "name" : "dawn", "display" : "DAWN" }
   var sunset = { "name" : "sunset", "display" : "SUNSET" }
   var night = { "name" : "dusk", "display" : "NIGHT" } 
   var dusk = { "name" : "mydusk", "display" : "DUSK" , "tod" : "PM" , "angle" : 5} 

   var tod = new Array(dawn,day,sunset,dusk,night)
   var top = { "name" : "NinjaHQ", "latitude" : -33.8600, "longitude" : 151.211 , "Times" : tod}
  
   return top;
   
 }
