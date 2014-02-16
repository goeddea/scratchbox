var connections = 0; // count active connections
var persistent = false;

self.addEventListener("connect", function (e) {
   var port = e.ports[0];
   connections++;
   
   port.addEventListener("message", function (e) {
      port.postMessage("Hello " + e.data + " (port #" + connections + ")");
      if(e.data === "setPersistent") {
         persistent = true;
         port.postMessage("'persistent'  set to " + persistent);
      } else if (e.data === "readPersistent") {
         port.postMessage(persistent);
      }           
   }, false);

   port.start();

}, false);