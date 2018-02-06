// Chapter 14.
"use strict";

$(document).ready(function() {

//
// 264
//
tprint("### Event handlers");

/*
addEventListener("click", function() {
    console.log("You clicked!");
});
*/

//
// 265
//
tprint("### Events and DOM nodes");

var button1 = document.getElementById("button1");
button1.addEventListener("click", function() {
    console.log("Button clicked.");
});

var button2 = document.getElementById("button2");
function once() {
    console.log("Done.");
    button2.removeEventListener("click", once);
}
button2.addEventListener("click", once);

//
// 266
//
tprint("### Event objects");

var button3 = document.getElementById("button3");
button3.addEventListener("mousedown", function(ev) {
    if (ev.which == 1)
        console.log("Left button");
    else if (ev.which == 2)
        console.log("Middle button");
    else if (ev.which == 3)
        console.log("Right button");
});

//
// 266
//
tprint("### Propagation");
var para1 = document.getElementById("para1");
var button4 = document.getElementById("button4");
para1.addEventListener("mousedown", function() {
    console.log("Handler for paragraph.");
});
button4.addEventListener("mousedown", function(ev) {
    console.log("Handler for button.");
    if (ev.which == 3) // => Right mouse button.
        ev.stopPropagation();
});

document.getElementById("div1").addEventListener("click", function(ev) {
    if (ev.target.nodeName == "BUTTON")
        console.log("Clicked", ev.target.textContent);
});

//
// 268
//
tprint("### Default actions");
var link1 = document.getElementById("link1");
link1.addEventListener("click", function(ev) {
    console.log("Nope.");
    ev.preventDefault();
});

//
// 269
//
tprint("### Key events");
var KEY_SPACE = 32; // ' '
var KEY_V = 86; // 'V'

var div2 = document.getElementById("div2");
addEventListener("keydown", function(ev) {
    if (ev.keyCode == KEY_V)
        div2.style.background = "violet";
});
addEventListener("keyup", function(ev) {
    if (ev.keyCode == KEY_V)
        div2.style.background = "";
});

addEventListener("keydown", function(ev) {
    if (ev.keyCode == KEY_SPACE && ev.ctrlKey) 
        console.log("Continuing!");
});

addEventListener("keypress", function(ev) {
    console.log(String.fromCharCode(ev.charCode));
});

//
// 271
//
tprint("### Mouse clicks");

// --Q: Are these var div3 = ... calls really necessary? Even without them
// Firefox (or jQuery) seems to create such names anyway.
var div3 = document.getElementById("div3");
var penDown = false;
div3.addEventListener("mousemove", function(ev) {
    if (!penDown)
        return;
    drawDot(this, ev.pageX - 4, ev.pageY - 4);
});

function drawDot(node, x, y) {
    var dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    node.appendChild(dot);
};

div3.addEventListener("mousedown", function(ev) {
    penDown = true;
    drawDot(this, ev.pageX - 4, ev.pageY - 4);
});

addEventListener("mouseup", function(ev) {
    penDown = false;
});

// --Q: Is this statement accurate?
// "For example, if I press down the mouse button on one paragraph and then 
// move the pointer to another paragraph and release the button, the 'click' 
// event will happen on the element that contains both those paragraphs."
//
// I cannot get this to work. Clicking between the paragraphs says 
// "This is not a paragraph.", but clicking in one paragraph and moving the
// pointer to the other paragraph, then releasing does not trigger the event.

var div4 = document.getElementById("div4");
div4.addEventListener("click", function(ev) {
    if (ev.target.nodeName != "P") {
        alert("That is not a paragraph.");
        return;
    }
    var p = ev.target;
    if (p.style.background == "")
        p.style.background = "yellow";
    else
        p.style.background = "";
});

//
// 272
//
tprint("### Mouse motion");
var lastX;
var rect1 = document.getElementById("rect1");
var BUTTON_LEFT = 1;
var BUTTON_MIDDLE = 2;
var BUTTON_RIGHT = 3;

rect1.addEventListener("mousedown", function(ev) {
    if (ev.which == BUTTON_LEFT) {
        lastX = ev.pageX;
        addEventListener("mousemove", moved);
        ev.preventDefault(); // Prevent selection (highlighting).
    }
});

function buttonPressed(ev) {
    if (ev.buttons == null)
        return ev.which != 0;
    else
        return ev.buttons != 0;
}

function moved(ev) {
    if (!buttonPressed(ev)) {
        removeEventListener("mousemove", moved);
    } else {
        var dist = ev.pageX - lastX;
        var newWidth = Math.max(10, rect1.offsetWidth + dist);
        rect1.style.width = newWidth + "px";
        lastX = ev.pageX;
    }
}

////
////

var para2 = document.getElementById("para2");

function isInside(node, target) {
    for (; node != null; node = node.parentNode)
        if (node == target) return true;
}

para2.addEventListener("mouseover", function(ev) {
    //console.log("mouseover");
    if (!isInside(ev.relatedTarget, para2)) {
        console.log("Change the color to red.");
        para2.style.color = "red";
    }
});

para2.addEventListener("mouseout", function(ev) {
    //console.log("mouseout");
    if (!isInside(ev.relatedTarget, para2)) {
        console.log("Change the color to default.");
        para2.style.color = "";
    }
});

//
// 275
//
tprint("### Scroll events");
var bar = document.querySelector(".progress div");
onScroll();

addEventListener("scroll", onScroll);

function onScroll() {
    //console.log("scrollHeight: ", document.body.scrollHeight);
    //console.log("innerHeight: ", innerHeight);
    //console.log("pageYOffset: ", pageYOffset);
    var max = document.body.scrollHeight - innerHeight;
    var percent = clamp((pageYOffset / max) * 100, 0, 100);
    bar.style.width = percent + "%";
    //console.log(percent + "%");
}

//
// 276
//
tprint("### Focus events");
var help = document.querySelector("#help");
var fields = document.querySelectorAll("#form1 input");
expect(fields.length, 2);
forEach(fields, function(input) {
    input.addEventListener("focus", function(ev) {
        var text = ev.target.getAttribute("data-help");
        help.textContent = text;
    });
    input.addEventListener("blur", function(ev) {
        // Use &nbsp; to maintain the <p>'s height.
        help.textContent = decodeEntities("&nbsp;");
    });
});

//
// 277
//
tprint("### Load event");

}); /* $(document).ready */

