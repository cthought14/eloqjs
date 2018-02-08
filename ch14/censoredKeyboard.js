// censoredKeyboard. Chapter 14, Exercise 1. Censored keyboard.
"use strict";

$(document).ready(function() {

var censored1 = document.querySelector("#censored1");

censored1.addEventListener("keypress", function(ev) {
    var ch = String.fromCharCode(ev.charCode)
    switch(ch) {
    case 'q': case 'Q':
    case 'w': case 'W':
    case 'x': case 'X':
        ev.preventDefault();
        return;
    }
});

}); /* $(document).ready */
