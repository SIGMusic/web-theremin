var urlParams = new URLSearchParams(window.location.search);
var peerId = null;
var peer = null;
var myId = null;
var connection = null;

// Mouse positions (in range [0-1] as percent)
var myMouse = {x: 0, y:0};
var peerMouse = {x:0, y:0};

// HTML Elements
var myIdElem = null;
var peerIdElem = null;
var inviteLinkElem = null;
var dotElem = null;

window.addEventListener("load", function(){
    // HTML Elements
    myIdElem = document.getElementById("myId");
    peerIdElem = document.getElementById("peerId");
    inviteLinkElem = document.getElementById("inviteLink");
    dotElem = document.getElementById("dot");

    init();

    document.onmousemove = function(event){
        myMouse.x = event.clientX / window.innerWidth;
        myMouse.y = event.clientY / window.innerHeight;
        if(connection && connection.open){
            connection.send({
                mouseX: myMouse.x,
                mouseY: myMouse.y
            })
        }

        adjustSound();
    }
});

// Initializes Peer-to-Peer connection
function init(){
    // Have PeerJS only print errors
    peer = new Peer(null, {
        debug: 2,
        host: 'web-theremin-peer-js-server.herokuapp.com',
        port: 80,
        path: '/',
        key: 'CheR4uo4'
    });
    peer.on('open', function(id){
        myId = id;
        myIdElem.innerHTML = "Your ID: " + myId;
        inviteLink.setAttribute("href", "?peer=" + myId);

        // Connect to another user if GET param is there
        peerId = urlParams.get('peer');
        if(peerId){
            connectToPeer(peerId);
        }
    });

    // Be ready for others to connect to us
    peer.on('connection', function(c){
        // Only allow a single connection
        if(connection && connection.open){
            console.log("Second connection attempt refused");
            c.on('open', function(){
                c.send("Already connected to another client.");
                setTimeout(function(){ c.close(); }, 500);
            });
            return;
        }

        // If not occupied, connect
        connection = c;
        peerId = connection.peer;

        onConnection();
    });
}

function connectToPeer(id){
     // Close the current connection
     if(connection){ connection.close(); }

     connection = peer.connect(id, {
         reliable: true
     });

     onConnection();
}

function onConnection(){
    connection.on('open', function(){
        peerId = connection.peer;
        console.log("Connected to peer:", peerId);
        peerIdElem.innerHTML = "Peer's ID: " + peerId;
    });

    connection.on('data', function(data){
        // console.log("Data received:", data);
        peerMouse.x = data.mouseX;
        peerMouse.y = data.mouseY;
        moveDot(peerMouse.x * window.innerWidth, peerMouse.y * window.innerHeight);
        adjustSound();
    });

    connection.on('close', function(){
        console.log("Connection Closed");
        connection = null;
        peerId = null;
        peerIdElem.innerHTML = "Peer's ID:";
    });
}

function moveDot(dx, dy) {
    dot.style.left=dx +'px';
    dot.style.top=dy +'px';
}
