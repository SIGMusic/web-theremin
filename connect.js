window.addEventListener("load", function(){
    peer = new Peer();
    document.onmousemove = function(event){
        console.log(event.clientX + " " + event.clientY)
    }
});