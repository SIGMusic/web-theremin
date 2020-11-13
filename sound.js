// Create the synth
const osc = new Tone.Oscillator().toDestination();
// Initial frequency (all the way left)
const initFreq = 440;
// Decibels per height
const hDivisions = 20;
osc.type = "sine";
osc.frequency.value = initFreq;
osc.volume.value = -10;

// Toggle with click
var on = false;
window.addEventListener("click", function(){
    if (on) {
        osc.stop();
    } else {
        osc.start();
    }
    on = !on
});

function adjustSound(){
    var dx = Math.abs(peerMouse.x - myMouse.x);
    var dy = Math.abs(peerMouse.y - myMouse.y);

    var toFreq = initFreq * Math.pow(2, dx);
    var toVol = hDivisions * dy;

    osc.frequency.value = toFreq;
    osc.volume.value = toVol;
}
