var persistent = false;

self.addEventListener("connect", function (e) {

   port.addEventListener("message", function (e) {
      if(e.data === "setPersistent") {

         persistent = true;
         port.postMessage("'persistent'  set to " + persistent);

      } else if (e.data === "readPersistent") {

         port.postMessage(persistent);

      }
   }, false);

   port.start();

}, false);
