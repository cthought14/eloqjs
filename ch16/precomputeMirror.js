// precomputedMirroring. Chapter 16, Exercise 4. Precomputed mirroring.
"use strict";

$(document).ready(function() {

function flipHorizontally(context, around /* e.g. = 100 + spriteW / 2 */) {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}

//
// Exercise 4 - Precomputed mirroring.
//
tprint("### Exercise 4");
var canvas1 = document.getElementById("canvas1");
showBorder(canvas1);
var cx1 = canvas1.getContext("2d");
var canvas_img;


var img1 = document.createElement("img");
img1.src = "img/player.png";
//var spriteW = 24;
//var spriteH = 30;
img1.addEventListener("load", function() {
    expect("load4", "load4");

    // HOW TO DRAW SOMETHING ON CANVAS AND THEN MAKE IT INTO AN IMG ELEMENT.    
    // Create temporary canvas. It will hold the flipped image.
    
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", img1.width);
    canvas.setAttribute("height", img1.height);
    var cx = canvas.getContext("2d");
    
    flipHorizontally(cx, img1.width / 2);
    cx.drawImage(img1, 
            0, 0, img1.width, img1.height);
    
    var div1 = document.getElementById("div1");
    //div1.appendChild(elt("p", "", "Flipped canvas:"));
    //div1.appendChild(canvas);
    
    // Save the temporary canvas as an img.
    
    canvas_img = document.createElement("img");
    canvas_img.src = canvas.toDataURL();
    
    // Draw the flipped img onto the exercise canvas.
    // --Q: Do I need another load event listener for this img tag? Without it, 
    // I seem to remember at least one time that the image did not seem to completely
    // load, but now I cannot reproduce the problem.
    
    canvas_img.addEventListener("load", function() {
        expect("load canvas_img", "load canvas_img");
        cx1.drawImage(canvas_img, 0, 0, canvas1.width, canvas1.height);
    });
});


}); /* $(document).ready */

