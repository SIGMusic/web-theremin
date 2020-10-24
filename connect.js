window.addEventListener("load", function(){
    let peer = new Peer();
    document.onmousemove = function(event){
        console.log(event.clientX + " " + event.clientY)
    }
});