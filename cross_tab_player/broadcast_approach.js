// // broadcasting

// const channel = new BroadcastChannel('player');

// var sendHello = function() {

//     channel.postMessage({
//         source: tabID,
//         type: "hello",
//         helloTime: Date.now()
//     })
// }
// sendHello();


//     // basic event broadcasting

// var externalTimeUpdate = false;
// var onAudioPlayerEvent  = function(event) {

//     // do not sent a timeupdate event if the audio player event
//     // was triggered by a broadcast event
//     if(event.type == "timeupdate" && externalTimeUpdate == true) {
//         externalTimeUpdate = false;
//         return;
//     }

//     let broadcastContent = {
//         source: tabID,
//         type: event.type
//     };
//     if(event.type == 'timeupdate') {
//         broadcastContent.playTime = event.timeStamp;
//     };

//     // console.log(event, broadcastContent);


//     channel.postMessage(broadcastContent);

// };

// const eventTypes = ['play', 'pause', 'ended', 'timeupdate'];
// eventTypes.forEach(eventType => player.addEventListener(eventType, onAudioPlayerEvent))


//     // broadcast event handling
// var updateCounter = 0;
// var loadTime = Date.now();
// var timeSinceLoad = 0;
// var onBroadcastEvent = function(event) {
//     if(event.data.source == tabID) {
//         return;
//     }
//     // console.log('received broadcast event', event.data.type);
//     switch (event.data.type) {
//         case 'timeupdate':
//             externalTimeUpdate = true;
//             updateCounter += 1;
//             timeSinceLoad = Date.now() - loadTime;
//             // console.log(updateCounter, timeSinceLoad / 1000);
//             // player.currentTime = event.data.playTime // does not set the (displayed) time
//             break;

//         case 'hello':
//             console.log("received 'hello'", event.data.source)
//             channel.postMessage({
//                 source: tabID,
//                 type: 'helloBack',
//                 target: event.data.source,
//                 helloTime: event.data.helloTime,
//                 helloBackTime: Date.now()
//             })
//             break;

//         case 'helloBack':
//             if(event.data.target == tabID) {
//                 console.log('received "helloBack" from',
//                     event.data.source, "helloReceive", event.data.helloBackTime - event.data.helloTime, "helloBackReceive", Date.now() - event.data.helloBackTime);
//             }
//             break;

//     }

// };

// channel.onmessage = onBroadcastEvent;

