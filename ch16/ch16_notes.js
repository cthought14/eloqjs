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
var canvas2 = document.getElementById("canvas2");
var cx2 = canvas2.getContext("2d");
showBorder(canvas2);
cx2.strokeStyle = "blue";
cx2.strokeRect(5, 5, 50, 50);
cx2.lineWidth = 5;
cx2.strokeRect(135, 5, 50, 50);

//
// 313
//
tprint("### 313 Paths");
var canvas3 = document.getElementById("canvas3");
showBorder(canvas3);
var cx3 = canvas3.getContext("2d");
cx3.beginPath();
for (var y = 10; y < 100; y += 10) {
    cx3.moveTo(10, y);
    cx3.lineTo(90, y);
}
cx3.stroke();

var canvas4 = document.getElementById("canvas4");
showBorder(canvas4);
var cx4 = canvas4.getContext("2d");
cx4.beginPath();
cx4.moveTo(50, 10);
cx4.lineTo(10, 70);
cx4.lineTo(90, 70);
// Automatically close the shape by implicitly drawing a line 
// to (50, 10) before filling.
cx4.fill(); 

//
// 314
//
tprint("### 314 Curves");

}); /* $(document).ready */

