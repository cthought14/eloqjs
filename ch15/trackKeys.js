// Chapter 15 (Project: A Platform Game). trackKeys example.
"use strict";

$(document).ready(function() {

tprint("### 304 Tracking keys");

// CODES: Mapping of key code => key name.

var arrowCodes /* : CODES */ = {
    37: "left",         // Key code: key name
    38: "up", 
    39: "right"
};

var otherCodes = {
    27: "esc"
};
    
var _trackKeys__testing = false;

// KEYS: Mapping of key name => bool. 
//      -- true means that key is pressed.

// trackKeys(codes : CODES) : KEYS
function trackKeys(codes /* = arrowCodes */) {
    var pressed = Object.create(null); /* pressed : KEYS */
    // Initialize for convenience.
    var keyCode;
    for (keyCode in codes) {
        pressed[codes[keyCode]] = false;
    }
    function handler(ev) {
        if (in_(ev.keyCode, codes)) { // (ev.keyCode in codes)
            var down = ev.type == "keydown";
            pressed[codes[ev.keyCode]] = down;
            // Prevent keys from scrolling the page.
            ev.preventDefault(); 
            if (_trackKeys__testing) {
                if (typeof trackKeys.counter == 'undefined' ) 
                    trackKeys.counter = 0;
                console.log(++trackKeys.counter, pressed);
            }
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

$("#trackKeys").click(function(ev) {
    ev.preventDefault();
    _trackKeys__testing = true;
    trackKeys(arrowCodes);
    console.log("Interactive testing of trackKeys ...");
});

// FRAMEFUNC: frameFunc(timeStep : double) : bool 
//      -- Should return false (not undefined) to signal stop of animation.

function runAnimation(frameFunc) {
    var lastTime = null;
    // FRAME: frame(time : long)
    function frame(time) {
        var stop = false;
        if (lastTime != null) {
            var timeStep = clamp(time - lastTime, 0, 100) / 1000;
            stop = frameFunc(timeStep) === false;
        }
        lastTime = time;
        if (!stop) {
            requestAnimationFrame(frame);
        }
    }
    requestAnimationFrame(frame);
}

////
////

var _trackKeys2__testing = false;
function trackKeys2(codes /* = arrowCodes */) {
    var pressed = Object.create(null); /* pressed : KEYS */
    // Initialize for convenience.
    var keyCode;
    for (keyCode in codes) {
        pressed[codes[keyCode]] = false;
    }
    var prevPressedCode = null;
    function handler(ev) {
        if (typeof trackKeys2.counter == 'undefined' ) 
            trackKeys2.counter = 0;
        if (in_(ev.keyCode, codes)) { // (ev.keyCode in codes)
            var up = ev.type == "keyup";
            if (up && !pressed[codes[ev.keyCode]]) {
                prevPressedCode = null;
            }
            var down = ev.type == "keydown";
            var activated = down && (prevPressedCode != ev.keyCode);
            if (!prevPressedCode) {
                if (_trackKeys2__testing) console.log(++trackKeys2.counter, "activated", activated, "down", down);
            }
            if (down)
                prevPressedCode = ev.keyCode;
            if (!pressed[codes[ev.keyCode]])
                pressed[codes[ev.keyCode]] = activated;
            // Prevent keys from scrolling the page.
            ev.preventDefault(); 
            if (_trackKeys2__testing) {
                if (typeof trackKeys2.counter == 'undefined' ) 
                    trackKeys2.counter = 0;
            }
        }
        else {
            prevPressedCode = null;
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

////
////

$("#trackKeys2").click(function(ev) {
    ev.preventDefault();
    _trackKeys2__testing = true;
    var keys = trackKeys2(otherCodes);
    var escPressCounter = 0;
    console.log("Interactive testing of trackKeys2 ...");
    runAnimation(function() {
        if (keys.esc) {
            keys.esc = false;
            console.log("((" + (++escPressCounter).toString() + "))", "Esc pressed.");
        }
        if (escPressCounter == 10) {
            console.log("Bye.");
            return false;
        }
    });
});

}); /* $(document).ready */
