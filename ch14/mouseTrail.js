// mouseTrail. Chapter 14, Exercise 2. Mouse trail.
"use strict";

$(document).ready(function() {

var drawCanvas = document.getElementById("drawCanvas");
var imgs = new Array(null, null, null, null);
var img_finished = null;
var step = 0;
var STEP_INTERVAL = 30; // Cycle frame after this many steps.
var STEPS_WARNING = 400; // Cecil is getting tired.
var STEPS_FINISHED = 500; // Cecil is too tired to continue.
var cimg = null;
var cdotIndex = 0;

function showStep() {
    var stepLabel = document.getElementById("stepLabel");
    stepLabel.textContent = step;
    if (step == STEPS_WARNING)
        stepLabel.style.color = "orange";
    if (cimg && cimg === img_finished)
        stepLabel.style.color = "red";    
}

function createImg(node, filename, x, y) {
    var img;
    img = document.createElement("div");
    img.className = "sprite";
    img.style.left = x + "px";
    img.style.top = y + "px";
    var url = 'url("' + filename + '")';
    img.style["background-image"] = url;
    img.style.display = "none";
    node.appendChild(img);
    return img;
}

drawCanvas.addEventListener("mousemove", function(ev) {
    var x = ev.pageX - 4;
    var y = ev.pageY - 4;
    showStep();

    if (imgs[0] === null) {
        imgs[0] = createImg(this, "img/cecil1.png", x, y);
    }
    if (imgs[1] === null) {
        imgs[1] = createImg(this, "img/cecil2.png", x, y);
    }
    if (imgs[2] === null) {
        imgs[2] = createImg(this, "img/cecil3.png", x, y);        
    }
    if (imgs[3] === null) {
        imgs[3] = createImg(this, "img/cecil4.png", x, y);
    }
    if (img_finished === null) {
        img_finished = createImg(this, "img/cecil_tired.png", x, y);        
    }
    
    if (step == 0) {
        cimg = imgs[cdotIndex];
        cimg.style.display = "";
        
        cimg.style.left = x + "px";
        cimg.style.top = y + "px";
        step++;        
    }
    else if (step == STEPS_FINISHED) {
        cimg.style.display = "none";
        cimg = img_finished;
        cimg.style.display = "";

        cimg.style.left = x + "px";
        cimg.style.top = y + "px";        
    }   
    else if (cimg !== img_finished && step % STEP_INTERVAL == 0) {
        cdotIndex = (cdotIndex + 1) % imgs.length;
        imgs[cdotIndex].style.display = ""; // Show next image.
        cimg.style.display = "none"; // Hide current image.
        cimg = imgs[cdotIndex]; // Set new current image.

        cimg.style.left = x + "px";
        cimg.style.top = y + "px";
        step++;                
    }
    else {
        cimg.style.left = x + "px";
        cimg.style.top = y + "px";
        step++;            
    }
});

}); /* $(document).ready */
