// Chapter 17 (HTTP).
"use strict";

$(document).ready(function() {

//
// 336
//
tprint("### 336 The protocol");

//
// 338
//
tprint("### 338 Browsers and HTTP");
expect(encodeURIComponent("Hello & goodbye"), "Hello%20%26%20goodbye");
expect(decodeURIComponent("Hello%20%26%20goodbye"), "Hello & goodbye");

//
// 340
//
tprint("### 340 XMLHttpRequest");

//
// 340
//
tprint("### 340 Sending a request");
$('#get1').click(function(ev) {
    ev.preventDefault();
    var req = new XMLHttpRequest();
    req.open("GET", "example/data.txt", false);
    req.send(null);
    console.log(req.responseText);
});

   


}); /* $(document).ready */

