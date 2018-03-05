// bouncingBall. Chapter 16, Exercise 3. A bouncing ball.
"use strict";

// From runAnimation.js
runAnimation

$(document).ready(function() {

//
// Exercise 3 - Bouncing ball.
//
tprint("### Exercise 3");
var canvas1 = document.getElementById("canvas1");
showBorder(canvas1);
var cx1 = canvas1.getContext("2d");

function clear_canvas(canvas, cx) {
    cx.clearRect(0, 0, 
                 canvas.width, canvas.height);
}

var ball_img = document.createElement("img");
ball_img.src = "img/ball_80px.png";
var ball_w = 80;
var ball_h = 80;
ball_img.addEventListener("load", function() {
    expect("load ball", "load ball");
    draw_img(cx1, 0, 0, 1, ball_img, 20, 20, ball_w, ball_h);
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
            draw_img(cx1, 0, 0, 1, ball_img, ballX, ballY, ball_w, ball_h);
            cx1.restore();
        });
        
        // hitPole => Would hit north or south of map.
        var hitPole = ballY < margin || ballY > canvas1.height - ball_h - margin;
        // hitMeridian => Would hit east or west of map.
        var hitMeridian = ballX < margin || ballX > canvas1.width - ball_w - margin;
        if (hitPole)
            ballDY *= -1;
        if (hitMeridian)
            ballDX *= -1;
        ballX += ballDX;
        ballY += ballDY;
    });
    
});


}); /* $(document).ready */

