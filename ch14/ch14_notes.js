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


}); /* $(document).ready */
