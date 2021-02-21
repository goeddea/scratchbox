console.log('loaded');


// instantiate the audio player

const player = document.createElement('audio');
player.src = 'daruma.mp3';
player.controls = true;
player.preload = 'auto';
document.body.appendChild(player);
const tabID = Math.floor(Math.random() * 100000000000);
console.log("tabId", tabID);

// broadcasting

const channel = new BroadcastChannel('player');

    // basic event broadcasting

var externalTimeUpdate = false;
var onAudioPlayerEvent  = function(event) {
    
    // do not sent a timeupdate event if the audio player event
    // was triggered by a broadcast event
    if(event.type == "timeupdate" && externalTimeUpdate == true) {
        externalTimeUpdate = false;
        return;
    }
    
    let broadcastContent = {
        source: tabID,
        type: event.type
    };
    if(event.type == 'timeupdate') {
        broadcastContent.playTime = event.timeStamp;
    };
    
    console.log(event, broadcastContent);
     

    channel.postMessage(broadcastContent);

};

const eventTypes = ['play', 'pause', 'ended', 'timeupdate'];
eventTypes.forEach(eventType => player.addEventListener(eventType, onAudioPlayerEvent))


    // broadcast event handling
var onBroadcastEvent = function(event) {
    console.log('received broadcast event', event);
    switch (event.data.type) {
        case 'timeupdate':
            externalTimeUpdate = true;
            player.currentTime = event.data.playTime // does not set the (displayed) time
    }
};

channel.onmessage = onBroadcastEvent;

