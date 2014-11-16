var autobahn = require('wamp-tessel');
var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['B']);

// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
   url: "ws://191.233.97.96/ws",
   realm: "ms_iot_hack_01"
});

// fired when connection is established and session attached
//
connection.onopen = function (session, details) {

   // session.subscribe("io.crossbar.iot.hack.test",
   //    function(args) {
   //       console.log(args[0]);
   //    });

   // setInterval(function() {
   //    session.publish("io.crossbar.iot.hack.test", ["IoT hacked"])
   // }, 2000)

};

// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
   console.log("Connection lost: " + reason);
}

// now actually open the connection
//
connection.open();


// Any copyright is dedicated to the Public Domain.
// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

// Initialize the accelerometer.
accel.on('ready', function () {
    // Stream accelerometer data
  accel.on('data', function (xyz) {
    console.log('x:', xyz[0].toFixed(2),
      'y:', xyz[1].toFixed(2),
      'z:', xyz[2].toFixed(2));
  });

});

accel.on('error', function(err){
  console.log('Error:', err);
});