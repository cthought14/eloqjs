// Chapter 16 (Drawing on Canvas).
"use strict";

$(document).ready(function() {

//
// 309
//
tprint("### 309 SVG")
$("#changeCircle").click(function(ev) {
    ev.preventDefault();
    var circle = document.querySelector("circle");
    if (circle.getAttribute("fill") != "red")
        circle.setAttribute("fill", "red");
    else
        circle.setAttribute("fill", "cyan");
});

//
// 310
//
tprint("### 310 The canvas element");
var canvas1 = document.getElementById("canvas1");
var context1 = canvas1.getContext("2d");
showBorder(canvas1);
context1.fillStyle = "red";
context1.fillRect(10, 10, 100, 50);

function showBorder(canvas) {
    var w = canvas.width;
    var h = canvas.height;
    var context = canvas.getContext("2d");
    context.strokeRect(0, 0, w, h);
}

//
// 312
//
tprint("### 312 Filling and stroking");


}); /* $(document).ready */

