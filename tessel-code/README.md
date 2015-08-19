# Alarmapp for Tessel

Alarm triggered via accelerometer (Tessel 1) causes a photo to be taken (Tessel 2). Alarm + photo are displayed in a HTML5 client, which also allows arming, disarming and canceling the alarm.

Put together during the Microsoft IoT Hackaton in Berlin; 13.11.2014.

## Hardware requirements

Two Tessels, one with an accelerometer module, one with a camera module.

## Running the demo

Just start Crossbar.io from the demo directory.

This serves the HTML5 frontend.

Connect the Tessel with the accelerometer and  do

```
tessel push tessel/accelerometer.js
```

the disconnect and restart.

For the Tessel with the camera do

```
tessel push tessel/camera.js
```



## Note on Crossbar.io configuration

Since the Tessel WS/WAMP libraries do not send the proper WebSocket subprotocol parameters, in the Crossbar configuration ignoring this needs to be set:

```
"type": "websocket",
"options": {
   "require_websocket_subprotocol": false   
} 
```

Since the Tessel has problems with WebSocket pings, do not set `auto_ping_interval` to anything but the default `0`.

## Note on hacking the Tessel code

As a consequence of not having the pings, Crossbar.io will most likely not detect the loss of connection when redeploying code on the Tessel. It is easiest to handle this by restarting Crossbar.io before each code redeployment.