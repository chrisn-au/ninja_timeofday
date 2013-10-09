
var stream = require('stream')
  , util = require('util');

// Give our module a stream interface
util.inherits(Device,stream);

var mydate = require('date-utils');
var querystring = require('querystring');
var request = require('request');
var SunCalc = require('suncalc');

var currentMode = '';

// util.inherits(getLocation,stream);

var home_lat = ''
var home_lng = ''


datastatus = false;

 // Export it
module.exports=Device;

const NIGHT = "NIGHT";
const MTL = "DAWN";
const DAY = "DAY";
const ETL = "DUSK";

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
function Device(lat,lng) {

  var self = this;

  // This device will emit data
  this.readable = true;
  // This device can be actuated
  this.writeable = false;

  this.G = "timeofday"; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 244; // 2000 is a generic Ninja Blocks sandbox device
  
  home_lat = lat;
  home_lng = lng;
 
  setdayTimes(); 
 
  function updateNinja(state)
  {
    now = new Date();
    self.emit('data', state);
    currentMode = state;
  }
  
 
  this._interval = setInterval(function() {
             self.emit('data', currentMode);
             if (!datastatus) { setdayTimes(); console.log("TOD NOT CURRENT");}
    },60000);

  
  function setdayTimes()
 {
    var today = new Date();   
    var times = SunCalc.getTimes(today,home_lat, home_lng );

    setTimeouts(today,times.sunriseEnd,times.dusk,times.dawn,times.night); 
 }

function setTimeouts( n,sr,ss,ts,te)
{
    tomorrow = new Date.tomorrow();   
  //  console.log("TOD ST" + ((n.getSecondsBetween(tomorrow) * 1000) + 50000));
    setTimeout(setdayTimes, ((n.getSecondsBetween(tomorrow) * 1000) + 50000));
    if ( (ts.getTime() - n.getTime()) > 0)  {setTimeout(updateNinja, (ts.getTime() - n.getTime()) , MTL)};
    if ( (sr.getTime() - n.getTime()) > 0)  {setTimeout(updateNinja, (sr.getTime() - n.getTime()) , DAY)};
    if ( (ss.getTime() - n.getTime()) > 0)  {setTimeout(updateNinja, (ss.getTime() - n.getTime()) , ETL)};
    if ( (te.getTime() - n.getTime()) > 0)  {setTimeout(updateNinja, (te.getTime() - n.getTime()) , NIGHT)}; 
        
    // start from that latest so now - end of twiglight > 0 then it must be night    
    if ((n.getTime() - te.getTime() ) > 0) {updateNinja(NIGHT); return};
    if ((n.getTime() - ss.getTime() ) > 0) {updateNinja(ETL); return};
    if ((n.getTime() - sr.getTime() ) > 0) {updateNinja(DAY); return} ;
    if ((n.getTime() - ts.getTime() ) > 0) {updateNinja(MTL); return};
    updateNinja(NIGHT); 
    return;
}    
};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */


 
