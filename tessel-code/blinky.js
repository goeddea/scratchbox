var autobahn = require('wamp-tessel');

// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
   url: "ws://191.233.97.96/ws",
   realm: "ms_iot_hack_01"
});

// fired when connection is established and session attached
//
connection.onopen = function (session, details) {

   console.log("connected");

   session.subscribe("io.crossbar.iot.hack.test",
      function(args) {
         console.log(args[0]);
      });

   setInterval(function() {
      session.publish("io.crossbar.iot.hack.test", ["IoT hacked"]);
   }, 2000)

   var test = function() {
      console.log("test called");
      return "test";
   };

   function add2(args) {
      return args[0] + args[1];
   }
   session.register('com.myapp.add2', add2);


   session.register("io.test3", test).then(
         function (registration) {
            console.log("Procedure 'io.test' registered:", registration.id);
         },
         function (error) {
            console.log("Registration failed:", error);
         }
      );

};

// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
   console.log("Connection lost: " + reason);
}

// now actually open the connection
//
connection.open();