// Chapter 12. HTML example.
"use strict";

var m1 = function() {
    var boom = function() {
        alert("Boom!");
    }
    
    return {
        boom: boom,
    };
}();
