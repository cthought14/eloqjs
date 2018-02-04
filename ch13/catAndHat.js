// catAndHat. Chapter 13. Exercise 3. The cat's hat.
"use strict";

$(document).ready(function() {

expect(document.querySelectorAll(".cat img").length, 1);
expect(document.querySelectorAll(".hat img").length, 1);

var stopAnimationRequested = true;
var once = true;

$("#animateButton").click(function(ev) {
    var ORIGIN = {x:300, y:100};
    ev.preventDefault();
    stopAnimationRequested = false;
    var cat = document.querySelector(".cat img");
    var hat = document.querySelector(".hat img");
    var angle = 0, lastTime = null;
    function animate(time) {
        if (lastTime != null)
            angle += (time - lastTime) * 0.001;
        lastTime = time;
        cat.style.top = (Math.sin(angle) * 20 + ORIGIN.y) + "px";
        cat.style.left = (Math.cos(angle) * 200 + ORIGIN.x) + "px";

        hat.style.top = (Math.sin(angle) * 20 + ORIGIN.y) + "px";
        hat.style.left = (-Math.cos(angle) * 200 + ORIGIN.x) + "px";
        if (!stopAnimationRequested)
            requestAnimationFrame(animate);
            
        if (once) {
            once = false;
            console.log("cat.style.top:", cat.style.top);
            console.log("cat.style.left:", cat.style.left);
            console.log("hat.style.top:", hat.style.top);
            console.log("hat.style.left:", hat.style.left);
        }
    }
    requestAnimationFrame(animate);
});

$("#stopButton").click(function(ev) {
    ev.preventDefault();
    stopAnimationRequested = true;
});

}); /* $(document).ready */
