import * as Tone from 'tone'

var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
var recvId = document.getElementById("receiver-id");
var status = document.getElementById("status");
var dot = document.getElementById("dot");
var w = window.innerWidth;
var h = window.innerHeight;

/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize() {

// Create the synth
const synth = new Tone.Synth().toDestination();
const now = Tone.now()
window.addEventListener("click", function(){
    synth.triggerAttack("C4", now)
});

// Create own peer object with connection to shared PeerJS server
peer = new Peer(null, {
    debug: 2
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
        console.log("Data recieved");
        var posObj = JSON.parse(data);
        console.log(posObj);
        // move(posObj.x - last.x, posObj.y - last.y);
        move(posObj.x, posObj.y);
        console.log("here");
        //last = posObj;
    });
    conn.on('close', function () {
        status.innerHTML = "Connection reset<br>Awaiting connection...";
        conn = null;
    });
}

initialize();

