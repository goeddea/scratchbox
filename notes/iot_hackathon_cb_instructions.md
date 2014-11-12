## WAMP - messaging from Tessel to anywhere

WAMP allows application components to communicate across devices and languages, including Tessel, NodeJS, the browser, Python, C#, Objective-C, C++, Java, PHP and Erlang! WAMP is a protocol which provides both the RPC and PubSub messaging pattern, so that any component can offer procedures for remote calling, call procedures, subscribe to topics and publish to them. WAMP is an open protocol, and there are open source implementations for a lot of languages.

## WAMP server for the IoT Hackathon

All WAMP messages are transmitted via a WAMP router. For the Microsoft IoT Hackathon we've set up an instance of Crossbar.io, an open source WAMP router, which you can use.

## Connecting to the WAMP router

Crossbar.io is reachable under

```
http://crossbar-test.cloudapp.net
```

To connect, below is boilerplate code & setup instructions for NodeJS and the browser. Copy & paste this - the only thing you need to individualize is the realm, see below:

For NodeJS, you need to have the `autobahn` npm package installed.

```
var autobahn = require('autobahn');

// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
   url: "ws://crossbar-test.cloudapp.net/ws",
   realm: "replace_with_your_realm"
});

// fired when connection is established and session attached
//
connection.onopen = function (session, details) {

   session.subscribe("io.crossbar.iot.hack.test",
      function(args) {
         console.log(args[0]);
      });

   setInterval(function() {
      session.publish("io.crossbar.iot.hack.test", ["IoT hacked"])
   }, 2000)

};

// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
   console.log("Connection lost: " + reason);
}

// now actually open the connection
//
connection.open();
```

For a browser, you need to include [AutobahnJS](https://autobahn.s3.amazonaws.com/autobahnjs/latest/autobahn.js) in your HTML - either (for development purposes only) from the S3 link or local.

```
// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
   url: "ws://crossbar-test.cloudapp.net/ws",
   realm: "replace_with_your_realm"
});

// fired when connection is established and session attached
//
connection.onopen = function (session, details) {

   session.subscribe("io.crossbar.iot.hack.test",
      function(args) {
         console.log(args[0]);
      });

   setInterval(function() {
      session.publish("io.crossbar.iot.hack.test", ["IoT hacked"])
   }, 2000)

};

// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
   console.log("Connection lost: " + reason);
}

// now actually open the connection
//
connection.open();
```


(untested)
The `autobahn` npm package does not seem to run on Tessel. 
For this reason, GitHub user `mykwillis` has created a minimalist version which has less features (but enough for most use cases). This is `wamp-tessel`- so install this instead.

Instead of 

```
var autobahn = require('autobahn');
``` 

you then do 

```
var autobahn = require('wamp-tessel');
```

(Let's keep things simple - the above code should work without changes then.)

For other languages, see the documentation or ask one of us (we're the guys with the Crossbar.io T-shirts).


## Picking a realm

Realms are routing domains - messages are only transmitted within a single realm. We've set up several realms for the IoT hackaton. Pick one and replace 'myRealm' in the above code snippets with it. Then check the realm so that nobody else picks it.

* [ ] `ms_iot_hack_01`
* [ ] `ms_iot_hack_02`
* [ ] `ms_iot_hack_03`
* [ ] `ms_iot_hack_04`
* [ ] `ms_iot_hack_05`
* [ ] `ms_iot_hack_06`
* [ ] `ms_iot_hack_07`
* [ ] `ms_iot_hack_08`
* [ ] `ms_iot_hack_09`
* [ ] `ms_iot_hack_10`
* [ ] `ms_iot_hack_11`
* [ ] `ms_iot_hack_12`
* [ ] `ms_iot_hack_13`
* [ ] `ms_iot_hack_14`
* [ ] `ms_iot_hack_15`
* [ ] `ms_iot_hack_16`

## Questions?

Talk to Tobias or Alex (the guys with the Crossbar.io shirts).  
