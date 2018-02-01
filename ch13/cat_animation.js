// Chapter 13. Cat animation example.
"use strict";

$(document).ready(function() {

expect(document.querySelectorAll(".cat img").length, 1);

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
