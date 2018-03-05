// bouncingBall. Chapter 16, Exercise 3. A bouncing ball.
"use strict";

$(document).ready(function() {

//
// Exercise 3 - Bouncing ball.
//
tprint("### Exercise 3");
var canvas1 = document.getElementById("canvas1");
showBorder(canvas1);
var cx1 = canvas1.getContext("2d");

function draw_ball(cx, x, y, s, Cx, Cy) {
    //cx.save();
    //cx.translate(x, y);
    //cx.scale(s, s);
    
    // center = (50, 50), radius = 40, angle = 0 to CIRCLE_ANGLE
    console.log("cx.arc",Cx,Cy);
    cx.arc(Cx, Cy, 40, 0, CIRCLE_ANGLE);
    cx.fillStyle = "brown";
    cx.fill();
    
    //cx.restore();
}

//draw_ball(cx1, 10, 10, 1, 50, 50);

function clear_canvas(canvas, cx) {
    //var cx = canvas.getContext("2d");
    //cx.fillStyle = "white";
    //cx.fillRect(0, 0, 
    //            canvas.width, canvas.height);
    cx.clearRect(0, 0, 
                 canvas.width, canvas.height);
}
/*
(function(canvas, cx) {
    $('#move_ball').click(function(ev) {
        clear_canvas(canvas);
        showBorder(canvas);
        draw_ball(cx, 10, 10, 1, 70, 70);
    });
})(canvas1, cx1);
*/

var img33 = document.createElement("img");
img33.src = "img/ball_80px.png";
var img33_w = 80;
var img33_h = 80;
img33.addEventListener("load", function() {
    expect("load33", "load33");
    draw_img(cx1, 0, 0, 1, img33, 20, 20, img33_w, img33_h);
});

function draw_img(cx, x, y, s, img, Ix, Iy, Iw, Ih) {
    cx.save();
    cx.translate(x, y);
    cx.scale(s, s);
    
    cx.clearRect(Ix, Iy, Iw, Ih);
    cx.drawImage(img, 
            // Source rectangle.
            0, 0, Iw, Ih,
            // Destination rectangle.
            Ix, Iy, Iw, Ih);
    cx.restore();
}

// From runAnimation.js
runAnimation


var totalTime = 0;
var nTimeSamples = 3000;
var curTimeSample = 0;

function time(name, action) {
    if (curTimeSample++ < nTimeSamples) {
        var start = Date.now();
        action();
        totalTime += Date.now() - start;
        if (curTimeSample == nTimeSamples) {
            console.log(name, "took", totalTime, "ms total", 
                        "("+nTimeSamples.toString()+" samples)");
        }
    }
    else {
        action();
    }
}

$('#move_ball').click(function(ev) {
    // Initial ball position.
    var ballX = 20;
    var ballY = 20;
    // Initially move down-right.
    var ballDX = 1;
    var ballDY = 1;
    // Assumed margin around top, right, bottom, and left.
    var margin = 2; 

    runAnimation(function(step) {
        cx1.clearRect(0, 0, 
            canvas1.width, canvas1.height);
        showBorder(canvas1);

        time("draw_img", function() {
            cx1.save();
            draw_img(cx1, 0, 0, 1, img33, ballX, ballY, img33_w, img33_h);
            cx1.restore();
        });
        
        // hitPole => Would hit north or south of map.
        var hitPole = ballY < margin || ballY > canvas1.height - img33_h - margin;
        // hitMeridian => Would hit east or west of map.
        var hitMeridian = ballX < margin || ballX > canvas1.width - img33_w - margin;
        if (hitPole)
            ballDY *= -1;
        if (hitMeridian)
            ballDX *= -1;
        ballX += ballDX;
        ballY += ballDY;
    });
    
});


}); /* $(document).ready */

