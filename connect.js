var urlParams = new URLSearchParams(window.location.search);
var peerId = null;
var peer = null;
var myId = null;
var connection = null;

// HTML Elements
var myIdElem = null;

window.addEventListener("load", function(){
    // HTML Elements
    myIdElem = document.getElementById("myId");

    init();

    document.onmousemove = function(event){
        //console.log(event.clientX + " " + event.clientY)
        if(connection && connection.open){
            connection.send({
                mouseX: event.clientX,
                mouseY: event.clientY
            })
        }
    }
});

// Initializes Peer-to-Peer connection
function init(){
    // Have PeerJS only print errors
    peer = new Peer(null, {debug: 1});
    peer.on('open', function(id){
        myId = id;
        myIdElem.innerHTML = "Your ID: " + myId;
        connectToPeer();
    });

    // Be ready for others to connect to us
    peer.on('connection', function(c){
        console.log("Recieved connection");

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
        console.log("Connected to:", peerId);

        connection.on('data', function(data){
            console.log("Data received:", data);
        });

        connection.on('close', function(){
            console.log("Connection Closed");
            connection = null;
            peerId = null;
        });
    });
}

function connectToPeer(){
    // Connect to another user if GET param is there
    peerId = urlParams.get('peer');
    if(peerId){
         // Close the current connection
         if(connection){ connection.close(); }

         connection = peer.connect(peerId, {
             reliable: true
         });

         connection.on('open', function(){
            console.log("Connected to peer:", peerId);
         });

         connection.on('data', function(data){
             console.log("Data received:", data);
         });

         connection.on('close', function(){
             console.log("Connection Closed");
             connection = null;
             peerId = null;
         });
    }
}
