var persistent = false;
var has_websocket = 'WebSocket' in this;

self.addEventListener("connect", function (e) {
   var port = e.ports[0];

   port.addEventListener("message", function (e) {
      if(e.data === "setPersistent") {

         persistent = true;
         port.postMessage("'persistent'  set to " + persistent);

         port.postMessage("sharedWorker has WS: " + has_websocket);

      } else if (e.data === "readPersistent") {

         port.postMessage("'persistent'  is " + persistent);

      }
   }, false);

   port.start();

}, false);


