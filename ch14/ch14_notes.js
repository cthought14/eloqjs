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


}); /* $(document).ready */
