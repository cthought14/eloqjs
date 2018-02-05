// draw_example. Chapter 14. Draw ("dot") example.
"use strict";

$(document).ready(function() {

var drawCanvas = document.getElementById("drawCanvas");
var penDown = false;
var ink = 500;
showInk();

drawCanvas.addEventListener("mousemove", function(ev) {
    if (!penDown)
        return;
    drawDot(this, ev.pageX - 4, ev.pageY - 4);
});

function drawDot(node, x, y) {
    if (ink == 0)
        return;
    var dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    node.appendChild(dot);
    ink--;
    showInk();
};

function showInk() {
    var inkLabel = document.getElementById("inkLabel");
    inkLabel.textContent = ink;
    if (ink == 99)
        inkLabel.style.color = "red";
}

drawCanvas.addEventListener("mousedown", function(ev) {
    penDown = true;
    drawDot(this, ev.pageX - 4, ev.pageY - 4);
});

addEventListener("mouseup", function(ev) {
    penDown = false;
});

}); /* $(document).ready */
