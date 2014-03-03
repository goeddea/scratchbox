# Test Case: Shared Web worker & persistent WebSocket connection

This is a test case for persistent WebSocket connections in a shared Web Worker.

Requirements:

   * WebSocket echo server at 'localhost:9000'. The included 'server.py' requires the [Autobahn|Python library](http://autobahn.ws/python/) to be installed.
   * A local Web server for the HTML files. If your running the above WebSocket echo server, then the simplest way to get this is to open a shell in the HTML directory and do 'python -m SimpleHTTPServer 8000' (or a convenient port other than '8000').

Start the test case by opening 'page_01.html'.

This instantiates a shared Web worker and, in the Web worker, triggers setting a variable 'persistent' to true and starting a WebSocket connection + sending of a heartbeat on this.
The page displays the WebSocket hearbeats.

It also contains a link to a second page. This displays the current value of 'persistent' plus the WebSocket hearbeat if this is being sent.

Play around with combinations of opening both successively in the same tab and opening multiple tabs (+ closing tabs again) to find out when shared Web workers persist.
