var vm = null;

// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
   url: "ws://192.168.1.134:8080/ws",
   realm: "ms_iot_hack_01"
});

var session = null; 

// Instantiate and bind the viewmodel
   vm = new ViewModel();
   ko.applyBindings(vm);


// fired when connection is established and session attached
//
connection.onopen = function (sess, details) {
   console.log("connected", details);

   session = sess;

   main();

};

function main () {

   // subscribe to future vote event
   session.subscribe("io.crossbar.iot.hack.camera",
      function(args) {
         var event = args[0];
         console.log("camera says", event);
      });

   
   session.call("io.crossbar.iotberlin.alarmapp.get_alarm_armed").then(
      function(res) {
         console.log("is not armed");
         vm.isArmed(res);
      },
      function(err) {
         console.log("get_alarm_armed error", err);
      }
   )

   session.subscribe("io.crossbar.iotberlin.alarmapp.on_alarm_armed", function(args) {
      console.log("armed state changed", args[0]);
      vm.isArmed(args[0]);
   })


   session.call("io.crossbar.iotberlin.alarmapp.get_alarm_active").then(
      function(res) {
         vm.isActive(res);
      },
      function(err) {
         console.log("get_alarm_active error", err);
      }
   )

   session.subscribe("io.crossbar.iotberlin.alarmapp.on_alarm_active", function(res) {
      var state = res[0];
      console.log("alarm active", state);
      vm.isActive(state);

   })

   session.subscribe("io.crossbar.iotberlin.alarmapp.on_picture_taken", function(res) {
      console.log("got picture", res);
      var b64img = hexToBase64(res[0]);
      vm.currentImage("data:image/jpg;base64," + b64img);
   })

   session.subscribe("io.crossbar.iotberlin.alarmapp.keepalive", function(args) {
      console.log("io.crossbar.iotberlin.alarmapp.keepalive");
   });


   session.subscribe("io.crossbar.iotberlin.alarmapp.cameralog", function(args) {
      console.log("cameralog", args[0], args[1]);
   });

   // session.subscribe("io.crossbar.iotberlin.alarmapp.accelerometerlog", function(args) {
   //    console.log("accelerometerlog", args[0], args[1]);
   // });

}


// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {

   console.log("Connection lost: " + reason);

}

// now actually open the connection
//
connection.open();

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function ViewModel () {

   var self = this;

   self.isArmed = ko.observable(null);
   self.requestImageActive = ko.observable(true);
   self.cancelAlarmActive = ko.observable(false);
   self.callCopsActive = ko.observable(false);
   self.isActive = ko.observable(false);
   self.currentImage = ko.observable("");

   self.requestImage = function () {
      var t0 = performance.now();

      // call the camera and display the result
      session.call("io.crossbar.iotberlin.alarmapp.take_picture").then(function(res) {
            var b64img = hexToBase64(res);
            self.currentImage("data:image/jpg;base64," + b64img);
         }, 
         function(err) {
            console.log("requestImage failed", err);
         }
      );
      console.log("requestImage call made");
   };

   self.arm = function () {
      // self.isArmed(true);
      session.call("io.crossbar.iotberlin.alarmapp.set_alarm_armed", [true]).then(session.log, session.log);
   };
   self.disarm = function() {
      // self.isArmed(false);
      session.call("io.crossbar.iotberlin.alarmapp.set_alarm_armed", [false]).then(session.log, session.log);
   }

   self.cancelAlarm = function () {
      // self.isActive(false);
      session.call("io.crossbar.iotberlin.alarmapp.set_alarm_active", [false])
   };
   self.triggerAlarm = function () {
      // self.isActive(true);
      session.call("io.crossbar.iotberlin.alarmapp.set_alarm_active", [true])  
   };

}

