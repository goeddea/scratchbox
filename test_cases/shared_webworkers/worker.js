var persistent = false,
    has_websocket = 'WebSocket' in this,
    session = null,
    counter = 0,
    ports = [];

self.addEventListener("connect", function (e) {
   var port = e.ports[0];
   port.start();

   port.addEventListener("message", function (e) {
      
      if(e.data === "setPersistent") {

         persistent = true;
         port.postMessage(persistent);

         if(session === null) {
            session = new WebSocket('ws://127.0.0.1:9000/');
            setInterval(function(){
               session.send(counter);
               counter += 1;
            }, 1000);
         }       

         session.onmessage = function(msg) { port.postMessage(parseInt(msg.data, 10)); };

      } else if (e.data === "readPersistent") {

         port.postMessage(persistent);
         
         session.addEventListener("message", function(msg) { port.postMessage(parseInt(msg.data, 10)); });

      }
   }, false);

   


}, false);


