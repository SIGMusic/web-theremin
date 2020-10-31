var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
var recvId = document.getElementById("receiver-id");
var status = document.getElementById("status");
var dot = document.getElementById("dot");
var w = window.innerWidth;
var h = window.innerHeight;

// Create the synth
const osc = new Tone.Oscillator().toDestination();
// Initial frequency (all the way left)
const initFreq = 440;
// Semitones per width
const wDivisions = 12;
// Decibels per height
const hDivisions = 20;
osc.type = "sine";
osc.frequency.value = initFreq;
osc.volume.value = -10;
var on = false;
window.addEventListener("click", function(){
    on = !(on)
    if (on == true) {
        osc.stop();
    } else {
        osc.start();
    }
});

/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize() {

// Create own peer object with connection to local PeerJS server
peer = new Peer(null, {
    debug: 2,
    // host: 'localhost',
    // port: 9000,
    // path: '/myapp'
});

peer.on('open', function (id) {
    // Workaround for peer.reconnect deleting previous id
    if (peer.id === null) {
        console.log('Received null id from peer open');
        peer.id = lastPeerId;
    } else {
        lastPeerId = peer.id;
    }

    console.log('ID: ' + peer.id);
    recvId.innerHTML = "ID: " + peer.id;
    status.innerHTML = "Awaiting connection...";
});
peer.on('connection', function (c) {
    // Allow only a single connection
    if (conn && conn.open) {
        c.on('open', function() {
            c.send("Already connected to another client");
            setTimeout(function() { c.close(); }, 500);
        });
        return;
    }

    conn = c;
    console.log("Connected to: " + conn.peer);
    status.innerHTML = "Connected";
    ready();
});
peer.on('disconnected', function () {
    status.innerHTML = "Connection lost. Please reconnect";
    console.log('Connection lost. Please reconnect');

    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
});
peer.on('close', function() {
    conn = null;
    status.innerHTML = "Connection destroyed. Please refresh";
    console.log('Connection destroyed');
});
peer.on('error', function (err) {
    console.log(err);
    alert('' + err);
});

dot.style.position = "absolute";

}

function move(dx, dy) {
    console.log("dx: " + dx + "dy: " + dy);
    dot.style.left=dx +'px';
    dot.style.top=dy +'px';
}

/**
 * Triggered once a connection has been achieved.
 * Defines callbacks to handle incoming data and connection events.
 */
function ready() {
    // var last = {x: 0, y: 0};
    conn.on('data', function (data) {
        // get window width and height (make these change when 
        // the window changes instead of checking every time)
        var width = window.innerWidth;
        console.log(width);
        var height = window.innerHeight;
        console.log(height);
        console.log("Data recieved");
        var posObj = JSON.parse(data);
        console.log(posObj);
        var toFreq = initFreq * Math.pow(2, posObj.x);
        var toVol = hDivisions * ((posObj.y * height) / height);
        osc.frequency.value = toFreq;
        osc.volume.value = toVol;
        console.log("Frequency: " + toFreq);
        move(posObj.x, posObj.y);
        console.log("here");
    });
    conn.on('close', function () {
        status.innerHTML = "Connection reset<br>Awaiting connection...";
        conn = null;
    });
}

initialize();

