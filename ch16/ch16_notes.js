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
cx2.strokeRect(15, 15, 50, 50);
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
var canvas5 = document.getElementById("canvas5");
showBorder(canvas5);
var cx5 = canvas5.getContext("2d");
cx5.beginPath();
cx5.moveTo(10, 90);
// control = (60, 10), goal = (90, 90)
cx5.quadraticCurveTo(60, 10, 90, 90);
cx5.lineTo(60, 10);
cx5.closePath();
cx5.stroke();

var canvas6 = document.getElementById("canvas6");
showBorder(canvas6);
var cx6 = canvas6.getContext("2d");
cx6.beginPath();
cx6.moveTo(10, 90);
// control1 = (10, 10), control2 = (90, 10), goal = (50, 90)
cx6.bezierCurveTo(10, 10, 90, 10, 50, 90);
cx6.lineTo(90, 10);
cx6.lineTo(10, 10);
cx6.closePath();
cx6.stroke();

var canvas7 = document.getElementById("canvas7");
showBorder(canvas7);
var cx7 = canvas7.getContext("2d");
cx7.beginPath();
cx7.moveTo(10, 10);
// control = (90, 10), goal = (90, 90), radius = 20
cx7.arcTo(90, 10, 90, 90, 20);
// Complete the line to the goal point if needed.
cx7.lineTo(90, 90); 
cx7.moveTo(10, 10);
// control = (90, 10), goal = (90, 90), radius = 80
cx7.arcTo(90, 10, 90, 90, 80);
// Complete the line to the goal point if needed.
cx7.lineTo(90, 90);
cx7.stroke();

var CIRCLE_ANGLE = 7 // More than 2 * Math.PI.

var canvas8 = document.getElementById("canvas8");
showBorder(canvas8);
var cx8 = canvas8.getContext("2d");
cx8.beginPath();
// center = (50, 50), radius = 40, angle = 0 to CIRCLE_ANGLE
cx8.arc(50, 50, 40, 0, CIRCLE_ANGLE);
// center = (150, 50), radius = 40, angle = 0 to PI*(1/2)
cx8.arc(150, 50, 40, 0, 0.5 * Math.PI);
cx8.stroke();

//
// 318
//
tprint("### 318 Drawing a pie chart");
var results1 = [
    {name: "Satisfied", count: 1043, color: "lightblue"},
    {name: "Neutral", count: 563, color: "lightgreen"},
    {name: "Unsatisfied", count: 510, color: "pink"},
    {name: "No comment", count: 175, color: "silver"}
];

var canvas9 = document.getElementById("canvas9");
//showBorder(canvas9);
var cx9 = canvas9.getContext("2d");

(function(cx, results) {
    var total1 = results.reduce(function(sum, choice) {
        return sum + choice.count;
    }, 0);

    var currentAngle = -0.5 * Math.PI;

    results.forEach(function(result) {
        var sliceAngle = (result.count / total1) * 2 * Math.PI;
        console.log(sliceAngle);
        cx.beginPath();
        // center = (100, 100), radius = 100
        cx.arc(100, 100, 100, currentAngle, currentAngle + sliceAngle);
        currentAngle += sliceAngle;
        cx.lineTo(100, 100);
        cx.fillStyle = result.color;
        cx.fill();
    });
})(cx9, results1);

//
// 319
//
tprint("### 319 Text");
var canvas10 = document.getElementById("canvas10");
showBorder(canvas10);
var cx10 = canvas10.getContext("2d");
cx10.font = "28px Georgia";
cx10.fillStyle = "fuchsia";
cx10.fillText("I can draw text, too!", 10, 50);

//
// 320
//
tprint("### 320 Images");
var canvas11 = document.getElementById("canvas11");
showBorder(canvas11);
var cx11 = canvas11.getContext("2d");
var img1 = document.createElement("img");
img1.src = "img/hat_100px.png";
// --Q: How do I detect image loading errors?
img1.addEventListener("load", function() {
    expect("load1", "load1");
    for (var x = 10; x < 100; x += 15)
        cx11.drawImage(img1, x, 10);
});

var canvas12 = document.getElementById("canvas12");
// This border will be hidden by the animation.
showBorder(canvas12);
var cx12 = canvas12.getContext("2d");
var img2 = document.createElement("img");
img2.src = "img/player.png";
var spriteW = 24;
var spriteH = 30;
img2.addEventListener("load", function() {
    expect("load2", "load2");
    var cycle = 0;
    setInterval(function() {
        cx12.clearRect(0, 0, spriteW, spriteH);
        cx12.drawImage(img2, 
                // Source rectangle.
                cycle * spriteW, 0, spriteW, spriteH,
                // Destination rectangle.
                0, 0, spriteW, spriteH);
        cycle = (cycle + 1) % 8;
    }, 120);
});

//
// 322
//
tprint("### 322 Transformation");
var canvas13 = document.getElementById("canvas13");
showBorder(canvas13);
var cx13 = canvas13.getContext("2d");
cx13.scale(3, .5);
cx13.beginPath();
cx13.arc(50, 50, 40, 0, 7);
cx13.lineWidth = 3;
cx13.stroke();


function flipHorizontally(context, around /* e.g. = 100 + spriteW / 2 */) {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}

var canvas14 = document.getElementById("canvas14");
showBorder(canvas14);
var cx14 = canvas14.getContext("2d");
var img3 = document.createElement("img");
img3.src = "img/player.png";
//var spriteW = 24;
//var spriteH = 30;
img3.addEventListener("load", function() {
    expect("load3", "load3");
    var x = 100, y = 0;
    flipHorizontally(cx14, x + spriteW / 2);
    cx14.drawImage(img3, 
            0, 0, spriteW, spriteH, 
            x, y, spriteW, spriteH);
});

//
// 325
//
tprint("### 325 Storing and clearing transformations");
var canvas15 = document.getElementById("canvas15");
showBorder(canvas15);
var cx15 = canvas15.getContext("2d");
function branch(length, angle, scale) {
    // Draw a "vertical" line.
    cx15.fillRect(0, 0, 1, length);
    if (length < 8)
        return;
    cx15.save();
    cx15.translate(0, length);
    cx15.rotate(-angle);
    branch(length * scale, angle, scale);
    cx15.rotate(2 * angle);
    branch(length * scale, angle, scale);
    cx15.restore();
}
cx15.translate(300, 0);
branch(60, 0.5, 0.8);

//
// 326
//
tprint("### 326 Back to the game");

// Display
// -------------------------------------
// Display(parent : Node, level : Level)
// drawFrame(step)
// clear()


// CanvasDisplay : Display
// -------------------------------------
// CanvasDisplay(parent, level)
// canvas : Node
// cx : Context2D
// level : Level
// animationTime
// flipPlayer : bool
// viewport: {left : float, 
//              top, width, height}
// 
// updateViewport()
// clearDisplay()
// drawBackground()
// drawActors()
// drawPlayer(x, y, width, height)


// CanvasDisplay::CanvasDisplay(parent, level)
function CanvasDisplay(parent, level) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = clamp(level.width * scale, 0, 600);
    this.canvas.height = clamp(level.height * scale, 0, 450);
    parent.appendChild(this.canvas);
    showBorder(this.canvas);
    this.cx = this.canvas.getContext("2d");
    
    this.level = level;
    this.animationTime = 0;
    this.flipPlayer = false;
    this.viewport = {
        left: 0,
        top: 0,
        width: this.canvas.width / scale,
        height: this.canvas.width
    };
    this.drawFrame(0);
}

// CanvasDisplay::drawFrame(step)
CanvasDisplay.prototype.drawFrame = function(step) {
    this.animationTime += step;
    this.updateViewport();
    this.clearDisplay();
    this.drawBackground();
    this.drawActors();
};

// CanvasDisplay::updateViewport()
CanvasDisplay.prototype.updateViewport = function() {
    var view = this.viewport;
    var margin = view.width / 3;
    var player = this.level.player;
    var center = player.pos.plus(player.size.times(0.5));
            // = player.pos + (player.size * 0.5)
    
    if (center.x < view.left + margin)
        view.left = Math.max(center.x - margin, 0);
    else if (center.x > view.left + view.width - margin)
        view.left = Math.min(center.x + margin - view.width,
                    this.level.width - view.width);
    if (center.y < view.top + margin)
        view.top = Math.max(center.y - margin, 0);
    else if (center.y > view.top + view.height - margin)
        view.top = Math.min(center.y + margin - view.height,
                    this.level.height - view.height);
};


// CanvasDisplay::clearDisplay()
CanvasDisplay.prototype.clearDisplay = function() {
    if (this.level.status == "won")
        this.cx.fillStyle = "rgb(68, 191, 255)";
    else if (this.level.status == "lost")
        this.cx.fillSTyle = "rgb(44, 136, 214)";
    else
        this.cx.fillStyle = "rgb(52, 166, 251)";
    this.cx.fillRect(0, 0, 
                this.canvas.width, this.canvas.height);
};

var otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";

// CanvasDisplay::drawBackground()
CanvasDisplay.prototype.drawBackground = function() {
    var view = this.viewport;
    var xStart = Math.floor(view.left);
    var xEnd = Math.ceil(view.left + view.width);
    var yStart = Math.floor(view.top);
    var yEnd = Math.ceil(view.top + view.height);
    
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var tile = this.level.grid[y][x];
            if (tile == null)
                continue;
            var screenX = (x - view.left) * scale;
            var screenY = (y - view.top) * scale;
            // Offset in sprite map for lava is 20 px.
            // Offset in sprite map for wall is 0 px.
            var tileX = tile == "lava" ? scale : 0;
            this.cx.drawImage(otherSprites,
                        tileX, 0, scale, scale,
                        screenX, screenY, scale, scale);
        }
    }
};

var playerSprites = document.createElement("img");
playerSprites.src = "img/player.png";
var playerXOverlap = 4;

// CanvasDisplay::drawPlayer(x, y, width, height)
CanvasDisplay.prototype.drawPlayer = function(x, y, width, height) {
    var sprite = 8;
    var player = this.level.player;
    width += playerXOverlap * 2;
    x -= playerXOverlap;
    if (player.speed.x != 0)
        this.flipPlayer = player.speed.x < 0;
        
    if (player.speed.y != 0)
        sprite = 9;
    else if (player.speed.x != 0)
        sprite = Math.floor(this.animationTime * 12) % 8;
        
    this.cx.save();
    if (this.flipPlayer)
        flipHorizontally(this.cx, x + width / 2);
        
    this.cx.drawImage(playerSprites, 
                sprite * width, 0, width, height,
                x, y, width, height);
    this.cx.restore();
};

// CanvasDisplay::drawActors() 
CanvasDisplay.prototype.drawActors = function() {
    this.level.actors.forEach(function(actor) {
        var width = actor.size.x * scale;
        var height = actor.size.y * scale;
        var x = (actor.pos.x - this.viewport.left) * scale;
        var y = (actor.pos.y - this.viewport.top) * scale;
        if (actor.type == "player") {
            this.drawPlayer(x, y, width, height);
        } 
        else {        
            // Sprite offset 2 is coin.
            // Sprite offset 1 is lava.
            var tileX = (actor.type == "coin" ? 2 : 1) * scale;
            this.cx.drawImage(otherSprites,
                        tileX, 0, width, ehgith,
                        x, y, width, height);
        }
    }, this);
};

//
// Exercise 1 - 1. Trapezoid.
//
var canvas21 = document.getElementById("canvas21");
showBorder(canvas21);
var cx21 = canvas21.getContext("2d");

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

draw_trapezoid(cx21, 50, 50, 5);
draw_trapezoid(cx21, 0, 0, 1);
draw_trapezoid(cx21, 100, 20, 1.5);

//
// Exercise 1 - 2. Red Diamond.
// 
var canvas22 = document.getElementById("canvas22");
showBorder(canvas22);
var cx22 = canvas22.getContext("2d");

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

draw_red_diamond(cx22, 10, 10, .25);

//
// Exercise 1 - 3. Zigzagging line.
//
var canvas23 = document.getElementById("canvas23");
showBorder(canvas23);
var cx23 = canvas23.getContext("2d");

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

draw_zigzag(cx23, 20, 20, 2.3, 6);

//
// Exercise 1 - 4. Spiral.
//
var canvas24 = document.getElementById("canvas24");
showBorder(canvas24);
var cx24 = canvas24.getContext("2d");

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

draw_spiral(cx24, 100, 100, 1.2);

//
// Exercise 1 - 5. Yellow star.
//
var canvas25 = document.getElementById("canvas25");
showBorder(canvas25);
var cx25 = canvas25.getContext("2d");

// TODO

//
// Exercise 2 - The pie chart.
//
var canvas31 = document.getElementById("canvas31");
showBorder(canvas31);
var cx31 = canvas31.getContext("2d");

var results2 = [
    {name: "Satisfied", count: 1043, color: "lightblue"},
    {name: "Neutral", count: 563, color: "lightgreen"},
    {name: "Unsatisfied", count: 510, color: "pink"},
    {name: "No comment", count: 175, color: "silver"}
];

function draw_pie_chart(cx, x, y, s, results) {
    cx.save();
    cx.translate(x, y);
    cx.scale(s, s);

    var total = results.reduce(function(sum, choice) {
        return sum + choice.count;
    }, 0);

    var currentAngle = -0.5 * Math.PI;
    cx.font = "10px Georgia";
    cx.fillStyle = "black";
    
    results.forEach(function(result) {
        var sliceAngle = (result.count / total) * 2 * Math.PI;
        console.log(sliceAngle);
        cx.beginPath();
        // center = (100, 100), radius = 100
        cx.arc(100, 100, 100, currentAngle, currentAngle + sliceAngle);

        var textAngle = currentAngle + 0.5 * sliceAngle;
        currentAngle += sliceAngle;
        cx.lineTo(100, 100);
        cx.fillStyle = result.color;
        cx.fill();
        
        var mx = 100, my = 100, r = 120;
        var x = mx + r * Math.cos(textAngle);
        var y = my + r * Math.sin(textAngle);
        if (textAngle > Math.PI * 3 / 2 || textAngle < Math.PI / 2)
            cx.fillText(result.name, x, y)
        else {
            // Assume each character is about 4 pixels wide on average.
            // It would be better to calculate using font metrics.
            var d = result.name.length * 4;
            cx.fillText(result.name, x - d, y)
        }
        //cx.fillRect(x, y, 10, 10);
        console.log("Text:",result.name,"textAngle:",textAngle);
        console.log("Result:",result.name);        
    });
    cx.restore();
}

draw_pie_chart(cx31, 100, 100, 1, results2);

//
// Exercise 3 - Bouncing ball.
//
var canvas33 = document.getElementById("canvas33");
showBorder(canvas33);
var cx33 = canvas33.getContext("2d");

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

//draw_ball(cx33, 10, 10, 1, 50, 50);

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
})(canvas33, cx33);
*/

var img33 = document.createElement("img");
img33.src = "img/ball_80px.png";
var img33_w = 80;
var img33_h = 80;
img33.addEventListener("load", function() {
    expect("load33", "load33");
    draw_img(cx33, 0, 0, 1, img33, 20, 20, img33_w, img33_h);
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

$('#move_ball').click(function(ev) {
    //clear_canvas(canvas33, cx33);
    //showBorder(canvas33);
    //draw_ball(cx33, 10, 10, 1, 70, 70);
    cx33.clearRect(0, 0, 
        canvas33.width, canvas33.height);
    showBorder(canvas33);
    /*
    cx33.font = "10px Georgia";
    cx33.fillStyle = "black";
    cx33.fillText("Hi", 40, 40);
    */
    draw_img(cx33, 0, 0, 1, img33, 40, 40, img33_w, img33_h);
    
});

}); /* $(document).ready */

