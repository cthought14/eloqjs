// Chapter 13.
"use strict";

$(document).ready(function() {
 
$("#changeButton").click(function(ev) {
    ev.preventDefault();
    var para2 = document.getElementById("para2");
    console.log("para2 color before:", para2.style.color);
    if (para2.style.color != "magenta")
        para2.style.color = "magenta";
    else
        para2.style.color = "purple";
    console.log("para2 color after:", para2.style.color);
});

var stopAnimationRequested = true;

$("#animateButton").click(function(ev) {
    ev.preventDefault();
    stopAnimationRequested = false;
    var cat = document.querySelector(".cat img");
    var angle = 0, lastTime = null;
    function animate(time) {
        if (lastTime != null)
            angle += (time - lastTime) * 0.001;
        lastTime = time;
        cat.style.top = (Math.sin(angle) * 20) + "px";
        cat.style.left = (Math.cos(angle) * 200) + "px";
        if (!stopAnimationRequested)
            requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});

$("#stopButton").click(function(ev) {
    ev.preventDefault();
    stopAnimationRequested = true;
});

}); /* $(document).ready */
