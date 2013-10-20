var data = require('./test.json');

var mydate = require('date-utils');
var SunCalc = require('suncalc');

var currentMode = '';

// util.inherits(getLocation,stream);

var home_lat = ''
var home_lng = ''

var OFFSET = "offset"
var ANGLE = "angle"
datastatus = false;


 
 locations = data.config.Locations;
 
 locations.forEach(function (location) {
        buildLoc(location)  
 });
 
 function buildLoc(loc)
 {
      
      var myTimes = [];
      
      loc.Times.forEach(function (time) {
                
        if(OFFSET in time){
            
            var timeObj = { name : time.name,
                            display : time.display,
                            ms : time.offset*1000};
            myTimes.push(timeObj)
        }
        else if(ANGLE in time){
           
            SunCalc.addTime(/*Number*/ time.angle, /*String*/ "am"+time.name, /*String*/ "pm"+time.name)
            var tname = "pm"+time.name;
            if (time.tod == "AM") { tname = "am"+time.name}
            var Obj = { name : tname,
                      display : time.display,
                      ms : 0};
            myTimes.push(Obj);
                                  
        }
        else { 
             var timeObj = { name : time.name,
                            display : time.display,
                            ms : 0};
             myTimes.push(timeObj)
        }     
        
      });
     
  
       var times = SunCalc.getTimes(new Date(), loc.latitude, loc.longitude);
       var now = new Date();
       
       myTimes.forEach(function (lc) {
         lc.time =  times[lc.name];
         lc.time = lc.time - lc.ms;
         lc.alertTime = (times[lc.name].getTime() - now.getTime() - lc.ms) ;
         lc.timeout = setTimeout(updateNinja, lc.altertTime , lc.display)
       });    
       myTimes.sort(function(a, b){
          return a.alertTime - b.alertTime
       })
       console.log(" ");  
       console.log("Location " + loc.name);
       console.log("Latitude " + loc.latitude);
       console.log("Longitude " + loc.longitude);
       for (var i = 0; i < myTimes.length; i++ ){
        
           var target = new Date(myTimes[i].time);
           console.log("State " + myTimes[i].display + " Time " + target.getHours() + ":" + target.getMinutes()); 
           console.log
           if (myTimes[i].alertTime > 0) { break; }
            currentState = myTimes[i].display
       }; 
       console.log("Current state " + currentState);
       console.log(" ");   
}
 
function updateNinja(state)
{
}  
/*  
 function setTimeouts( l)
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

*/
