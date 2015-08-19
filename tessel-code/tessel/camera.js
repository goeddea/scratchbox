var autobahn = require('wamp-tessel');
var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['A']);
var when = autobahn.when; 
var session = null;

// console.log(autobahn.when);

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture
var cameraReady = false;

camera.on('ready', function() {
   
   console.log("camera ready");

   camera.setResolution("qqvga");
   // camera.setResolution("qvga");

   main();

});

camera.on('error', function(err) {
   console.error(err);
   // add a publication of camera error - IMPLEMENT ME!!!
});

function main () {

   // the WAMP connection to the Router
   //
   var connection = new autobahn.Connection({
      url: "ws://192.168.1.134:8080/ws",

      realm: "ms_iot_hack_01"
      // realm: "realm1"
   });

   // fired when connection is established and session attached
   //
   connection.onopen = function (sess, details) {

      console.log("connected");

      session = sess;

      session.publish("io.crossbar.iotberlin.alarmapp.cameralog", ["camera_ready"]);

      // send publishes to keep wifi alive (testing)
      // setInterval(function() {
      //    session.publish("io.crossbar.iotberlin.alarmapp.keepalive");
      //    console.log("keepalive sent");
      // }, 1000);

            
      function takePicture () {

         var t0 = Date.now();

         console.log("takePicture called");
         session.publish("io.crossbar.iotberlin.alarmapp.cameralog", ["takePicture called"]);

         var cameraResult = when.defer();

         camera.takePicture(function (err, image) {

            console.log("picture taken", Date.now() - t0);
            session.publish("io.crossbar.iotberlin.alarmapp.cameralog", ["picture taken", Date.now() - t0]);
            
            // notification LED on for two seconds
            // notificationLED.high();
            // setTimeout(function() {
            //    notificationLED.low();
            // }, 2000);

            if (err) {
               console.log('error taking image', err);
               cameraResult.reject(err);
            } else {
               console.log('here is an image', Date.now() - t0);
               // need to encode image before sending
               try {
                  console.log("starting encoding", Date.now() - t0);
                  session.publish("io.crossbar.iotberlin.alarmapp.cameralog", ["encoding started", Date.now() - t0]);
                  // var encodedImage = new Buffer(image).toString("hex");
                  // var encodedImage = new Buffer(image).toString("base64");
                  var encodedImage = image.toString("hex");

                  console.log("encoding ended", Date.now() - t0);
                  session.publish("io.crossbar.iotberlin.alarmapp.cameralog", ["encoding finished", Date.now() - t0]);
                  cameraResult.resolve(encodedImage);
                  // cameraResult.resolve("hallo");
               } catch (e) {
                  console.log("error,", e);
               }
               
            }
         });

         return cameraResult.promise; 
      };

      // cameraResult.resolve("called");

      // var takePicture = function() {
      //    console.log("takePicture called");

      //    return true;
      // }

      session.register("io.crossbar.iotberlin.alarmapp.take_picture", takePicture).then(
         function (registration) {
            console.log("Procedure 'io.crossbar.iotberlin.alarmapp.take_picture' registered:", registration.id);
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

}