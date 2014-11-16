var vm = null;

// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
   url: "ws://191.233.97.96/ws",
   realm: "ms_iot_hack_01"

   // url: "ws://191.233.97.96:8080",
   // realm: "realm1"
});

var session = null; 


// fired when connection is established and session attached
//
connection.onopen = function (sess, details) {
   console.log("connected", details);

   session = sess;

   main();

   // KnockoutJS viewmodel

   // Instantiate and bind the viewmodel
   vm = new ViewModel();
   ko.applyBindings(vm);

};

function main () {
   // subscribe to future vote event
   session.subscribe("io.crossbar.iot.hack.camera",
      function(args) {
         var event = args[0];
         console.log("camera says", event);
      });

     
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

   console.log("vm executed");

   // arm + disarm
   self.isArmed = ko.observable(null);

   // request image
   self.requestImageActive = ko.observable(true);

   //  cancel, callCops, trigger
   self.cancelAlarmActive = ko.observable(false);
   self.callCopsActive = ko.observable(false);

   // alarm itself
   self.isActive = ko.observable(false);

   // displayed image
   self.currentImage = ko.observable("");

   self.requestImage = function () {
      console.log("requestImage called", session);
      var t0 = performance.now();

      // call the camera and display the result
      session.call("io.crossbar.hack.take_picture").then(function(res) {
            // console.log("image received", performance.now() - t0);
            var b64img = hexToBase64(res);
            // console.log("image converted", performance.now() - t0);
            self.currentImage("data:image/jpg;base64," + b64img);
             // console.log("set image", performance.now() - t0);
         }, 
         function(err) {
            console.log("requestImage failed", err);
         }
      );
      console.log("requestImage call made");
   };


   // arming, disarming
   self.arm = function () {
      // self.isArmed(true);
      session.call("io.crossbar.iotberlin.alarmapp.set_alarm_armed", [true]).then(session.log, session.log);
   };
   self.disarm = function() {
      // self.isArmed(false);
      session.call("io.crossbar.iotberlin.alarmapp.set_alarm_armed", [false]).then(session.log, session.log);
   }

   session.call("io.crossbar.iotberlin.alarmapp.get_alarm_armed").then(
      function(res) {
         console.log("is not armed");
         self.isArmed(res);
      },
      function(err) {
         console.log("get_alarm_armed error", err);
      }
   )

   session.subscribe("io.crossbar.iotberlin.alarmapp.on_alarm_armed", function(args) {
      console.log("armed state changed", args[0]);
      self.isArmed(args[0]);
   })

   // get_alarm_armed
   // get_alarm_active
   // set_alarm_active
   // on_alarm_active

   // alarm events
   session.call("io.crossbar.iotberlin.alarmapp.get_alarm_active").then(
      function(res) {
         self.isActive(res);
      },
      function(err) {
         console.log("get_alarm_active error", err);
      }
   )

   self.cancelAlarm = function () {
      // self.isActive(false);
      session.call("io.crossbar.iotberlin.alarmapp.set_alarm_active", [false])
   };
   self.triggerAlarm = function () {
      // self.isActive(true);
      session.call("io.crossbar.iotberlin.alarmapp.set_alarm_active", [true])  
   };

   session.subscribe("io.crossbar.iotberlin.alarmapp.on_alarm_active", function(res) {
      var state = res[0];
      console.log("alarm active", state);
      self.isActive(state);

      // if (res[0] === true) {
      //    console.log("do requestImage");
      //    self.requestImage();
      // }

   })

   session.subscribe("io.crossbar.iotberlin.on_picture_taken", function(res) {
      console.log("got picture", res);
      var b64img = hexToBase64(res[0]);
      // console.log("image converted", performance.now() - t0);
      self.currentImage("data:image/jpg;base64," + b64img);
       // console.log("set image", performance.now() - t0);
   })

}

