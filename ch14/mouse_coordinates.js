// mouse_coordinates. Chapter 14. Mouse coordinates example.
"use strict";

$(document).ready(function() {

var coords = document.querySelector("#coords");
function displayCoords(ev) {
    coords.textContent = "Mouse at " + ev.pageX + ", " + ev.pageY;
}

function frameInterval(desired_fps) { return 1000 / desired_fps; }

var scheduled = false;
var lastEvent;
var interval = frameInterval(24);

addEventListener("mousemove", function(ev) {
    lastEvent = ev;
    if (!scheduled) {
        scheduled = true;
        setTimeout(function() {
            scheduled = false;
            displayCoords(lastEvent);
        }, interval);
    }
});

}); /* $(document).ready */
