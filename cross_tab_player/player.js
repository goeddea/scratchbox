console.log('loaded');


// instantiate the audio player

const player = document.createElement('audio');
player.src = 'daruma.mp3';
player.controls = true;
player.preload = 'auto';
document.body.appendChild(player);

const tabID = Math.floor(Math.random() * 1000000000);
console.log("tabId", tabID);


let playButtons = document.getElementsByClassName("js-button-play")

Array.prototype.forEach.call(playButtons, function(playButton) {
    playButton.addEventListener("click", function() {
        if (playButton.classList.contains("is-paused")) {
            player.play()
        } else {
            player.pause()
        }
    })
})

player.addEventListener("play", function(event) {
    Array.prototype.forEach.call(playButtons, function(playButton) {
        playButton.classList.remove("is-paused")
        playButton.children[0].textContent = "pause_circle"
    })
})

player.addEventListener("pause", function(event) {
    Array.prototype.forEach.call(playButtons, function(playButton) {
        playButton.classList.add("is-paused")
        playButton.children[0].textContent = "play_circle"
    })
})


// shared worker

var worker = new SharedWorker('sharedworker.js?v=10');
// worker.port.start(); // this will trigger the on connect event on the webworker
worker.port.onmessage = function(e) {
    console.log("worker says", e.data);
}

worker.port.postMessage({
    type: "addTab",
    target: false,
    payload: {
        tabID: tabID,
    }
})