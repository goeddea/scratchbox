#  Cross-Tab Player

## User story

As a streaming service user I want to be able to control the music from any of the tabs I may have open in parallel.


## Functional Requirements

- All players need to display the same track information and play time
- Additional potential features to sync
    - repeat track/repeat album
    - playlist/queue
    - time display: played/remaining
    - large/small cover art display
- Since multiple tabs can be visible in parallel (multiple windows) sync needs to be near real time. (A couple hundred ms should not be a usability issue)
- One tab plays the audio
- If this is closed, another tab takes over, probably next tab in opening order
	
## Coordination Channel

- WAMP - playing tab publishes active state and sync data, others subscribe
- shared worker - playing tab updates state, other tabs get events from the worker
    - https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
    - has nice state in the worker, somehow this appeals to me as a concept
    - tabs register when they open, makes picking the next to play simple
    - unfortunately, this cannot be the audio player - see e.g. https://bugs.chromium.org/p/chromium/issues/detail?id=1131236
- broadcast channel - playing tab broadcasts, other tabs receive
    - https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
    - simple, very flexible (send some simple JSON works for this purpose)
    - need to have a handler for the onclose event for the tab - otherwise others need to deduct closing from lack of updates of position
    - order of tabs needs to be stored e.g. in localstorage

## PoC

- get simple development server to run - the Python one is fine for this
- get an editor set up (copy over my VisualStudio Code settings from T450s)
- a few audio tracks in a folder
- player:
    - play/pause
    - next/previous
    - position within track (can be display only)
    - preset playlist
    - no need to read metadata (ID3 tags or whatever) from the audio files if this is complicated - can be hardcoded
- sync data
    - track (can be position in playlist)
    - position within track
    - track playing (do not want to derive this from lack of update of position within track)
- sync method
    - try broadcast channel first

------------------
# practicals

start the ssh-agent in the background
$ eval `ssh-agent -s`
> Agent pid 59566

$ ssh-add ~/.ssh/id_ed25519

python -m http.server
