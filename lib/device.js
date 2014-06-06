var stream = require('stream')
  , util = require('util');

// Give our module a stream interface
util.inherits(Device,stream);

var mydate = require('date-utils');
var SunCalc = require('suncalc');

 // Export it
module.exports=Device;

var OFFSET = "offset"
var ANGLE = "angle"
datastatus = false;


/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the cloud
 *
 * @fires data - Emit this when you wish to send data to the cloud
 */
function Device(location, app) {

  var self = this;

  // This device will emit data
  this.readable = true;
  // This device can be actuated
  this.writeable = false;

  this.G = "timeoofday"+location.name; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 244; // 2000 is a generic Ninja Blocks sandbox device
  this.name = location.name + " Time of Day ";
  this.currentMode = '';
  setdayTimes(location);

  function updateNinja(state)
  {
    app.log.info(location.name + ': updating state to: ' + state)
    self.emit('data',  state );
    self.currentMode = state;
  }
  
 
  this._interval = setInterval(function() {
             console.log(self.currentMode); 
             self.emit('data', self.currentMode);
  },60000);

  
  function setdayTimes()
  {
    self.phases = [];

    buildLoc(location);

    processTimes();

    // wait 10secs to ensure that device is already registered before sending data
    setTimeout(function() {
      updateNinja(self.phases.State);
    }, 10000);
  }
 
  function buildLoc(loc)
  {
      
      var phases = self.phases
      
      phases.name = loc.name;
      phases.lat =  loc.latitude;
      phases.lng =  loc.longitude
      
      
      loc.Times.forEach(function (time) {
                
        if(OFFSET in time){
            
            var timeObj = { name : time.name,
                            display : time.display,
                            ms : time.offset*1000};
                            
            phases.push(timeObj)
            
        }
        else if(ANGLE in time){
           
            SunCalc.addTime(/*Number*/ time.angle, /*String*/ "am"+time.name, /*String*/ "pm"+time.name)
            var tname = "pm"+time.name;
            if (time.tod == "AM") { tname = "am"+time.name}
            var Obj = { name : tname,
                      display : time.display,
                      ms : 0};
            phases.push(Obj);

        }
        else { 
             var timeObj = { name : time.name,
                            display : time.display,
                            ms : 0};
             phases.push(timeObj)
        }     
        
      });
      
  }

  function processTimes()
  {
       var phases = self.phases;
       var times = SunCalc.getTimes(new Date(), phases.lat, phases.lng);
       var nextDayTimes = SunCalc.getTimes(Date.tomorrow().addMinutes(5), phases.lat, phases.lng);
       var now = new Date();
      
      // retrieve the time from the SunCalc object and add the delta (+/-)
      
       phases.forEach(function (lc) {
       
         lc.time =  times[lc.name].getTime() + lc.ms;    //ms from start of time to alert    
         if (new Date(lc.time).isBefore(now)) {
            lc.time = nextDayTimes[lc.name].getTime() + lc.ms;
         }
         lc.alertTime = (lc.time - now.getTime()) ;  // ms to altert 
         if (lc.alertTime > 0) {
            app.log.info(location.name +  ': setting up ' + lc.display + ' at ' + new Date(lc.time))
            setTimeout(updateNinja, lc.alertTime , lc.display)
         } else {
            app.log.debug(location.name +  ': not setting up ' + lc.display + ' as ' + new Date(lc.time) + ' is in the past')
         }
       });
       
       // sort phases 
           
       phases.sort(function(a, b){
          return a.alertTime - b.alertTime  // in ascending order
       })
       
      
       // default the currentstate to the last one in the list (usually night)
       
       phases.State = phases[phases.length - 1].display
       
       // create the timeouts and set current state to most recent expired
       phases.forEach(function (lc) {
           if (lc.alertTime < 0) {   phases.State = lc.display    }     
    
       }); 
     
     
       var n = new Date();
       var tomorrow = Date.tomorrow().addMinutes(5);
       app.log.info(location.name + ': scheduling recalc for: ' + tomorrow)
       setTimeout(setdayTimes, n.getSecondsBetween(tomorrow) * 1000);         
            
                
  }

}
