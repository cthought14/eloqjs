// shapes. Chapter 16, Exercise 1. Shapes
"use strict";

$(document).ready(function() {

//
// Exercise 1 - 1. Trapezoid.
//
tprint("### Exercise 1");
var canvas1 = document.getElementById("canvas1");
showBorder(canvas1);
var cx1 = canvas1.getContext("2d");

function draw_trapezoid(cx, x, y, s) {
    cx.save();
    cx.translate(x, y);
    cx.scale(s, s);
    cx.beginPath();
    cx.moveTo(10,10);
    cx.lineTo(0,25);
    cx.lineTo(35,25);
    cx.lineTo(25,10);
    cx.closePath();
    cx.stroke();
    cx.restore();
}

draw_trapezoid(cx1, 50, 50, 5);
draw_trapezoid(cx1, 0, 0, 1);
draw_trapezoid(cx1, 100, 20, 1.5);

//
// Exercise 1 - 2. Red Diamond.
// 
var canvas2 = document.getElementById("canvas2");
showBorder(canvas2);
var cx2 = canvas2.getContext("2d");

function draw_red_diamond(cx, x, y, s) {
    cx.save();
    cx.translate(x, y);
    cx.scale(s, s);
    cx.translate(72, 1);
 
    cx.rotate(Math.PI / 4);
    cx.fillStyle = "red";
    cx.fillRect(0, 0, 100, 100);    
    cx.restore();
}

draw_red_diamond(cx2, 10, 10, .25);

//
// Exercise 1 - 3. Zigzagging line.
//
var canvas3 = document.getElementById("canvas3");
showBorder(canvas3);
var cx3 = canvas3.getContext("2d");

function draw_zigzag(cx, x, y, s, nZigzags) {
    cx.save();
    cx.translate(x, y);
    cx.scale(s, s);
    
    cx.beginPath();
    cx.moveTo(0, 0);
    for (var n = 0; n < nZigzags; n++) {
        cx.lineTo(20, 2.5);
        cx.lineTo(2.5, 5);
        cx.translate(0, 5);
    }
    cx.lineTo(0, .3);
    cx.stroke();
    cx.restore();
}

draw_zigzag(cx3, 20, 20, 2.3, 6);

//
// Exercise 1 - 4. Spiral.
//
var canvas4 = document.getElementById("canvas4");
showBorder(canvas4);
var cx4 = canvas4.getContext("2d");

function draw_spiral(cx, x, y, s) {
    cx.save();
    cx.translate(x, y);
    cx.scale(s, s);

    cx.beginPath();
    cx.moveTo(r * Math.cos(0), r * Math.sin(0));

    // For the moment the decay, radius and
    // number of swirls need to be adjusted 
    // together. I would like to be able to just
    // calculate the optimal decay for a given
    // radius and number of swirls.
    var swirls = 3;
    var r = 40;
    var decay = 0.20;
    
    var x, y;
    for (var angle = 0; 
        angle < 2 * Math.PI * swirls;
        angle += 0.1, r -= decay) {
        x = r * Math.cos(angle);
        y = r * Math.sin(angle);
        cx.lineTo(x, y);
    }
    cx.stroke();    
    cx.restore();
}

draw_spiral(cx4, 100, 100, 1.2);

//
// Exercise 1 - 5. Yellow star.
//
var canvas5 = document.getElementById("canvas5");
showBorder(canvas5);
var cx5 = canvas5.getContext("2d");

// TODO


}); /* $(document).ready */
