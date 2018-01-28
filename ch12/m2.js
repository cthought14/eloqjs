// Chapter 12. HTML and jQuery example.
"use strict";

var m2 = function() {
    var boom = function() {
        alert("Boom!");
    }
    
    var isHidden = true;
    
    return {
        boom: boom,
        isHidden: isHidden,
    };
}();

$(document).ready(function() {
    $("#boomButton").click(function(ev) {
        ev.preventDefault();
        if (m2.isHidden) {
            $("#boomMessage").show("slow");
            m2.isHidden = false;
        }
        else {
            $("#boomMessage").hide("slow");
            m2.isHidden = true;
        }
    });
});
