onconnect = function(e) {

    var port = e.ports[0];

    var state = {
        tabs: [],
        playerTab: null,
        // focusTab: null,
        playList: [],
        playListPosition: null,
        trackPosition: null,
        playState: "paused"
    }


    var addTab = function(e) {
        // stretch: check if ID exists, resolve conflict (the two tabs need to re-roll the dice)
        state.tabs.push(e.tabID);

        // if is first tab --> maybe initialize as player tab (preload audio file for faster startup)
    };

    var removeTab = function(e) {
        // check if is player tab --> elect new player tab

        let pos = state.tabs.indexOf(e.tabID);
        if(pos > -1) {
            state.tabs.splice(pos, 1);
        }
    };

    var getState = function(e) {
        port.postMessage({
            target: e.source,
            state: state,
        })
    };

    var updatePlaylist = function(e) {

    };

    var updatePlaylistPosition = function(e) {

    };

    var updateTrackPosition = function(e) {

    };

    var updatePlayState = function(e) {
        // validatey playstate
        // check if equals current play state
        state.playState = e.playState;
        port.postMessage(e.playState);
    };

    port.onmessage = function(e) {
        switch (e.type) {

            case 'addTab':
                addTab(e);
                break;
            case 'removeTab':
                removeTab(e);
                break;
            case 'getState':
                getState(e);
                break;
            case 'updatePlaylist':
                updatePlaylist(e);
                break;
            case 'updatePlaylistPosition':
                updatePlaylistPosition(e)
                break;
            case 'updateTrackPosition':
                updateTrackPosition(e)
                break;
            case 'updatePlayState':
                updatePlayState(e)
                break;
        }
    }

    port.postMessage("hello");
}

