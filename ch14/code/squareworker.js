// code/squareworker.js
"use strict";

addEventListener("message", function(ev) {
    postMessage(ev.data * ev.data);
});
