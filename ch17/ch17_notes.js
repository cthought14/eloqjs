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
    // If the server does not send a Content-Type, it is assumed to be "text/xml"
    // and Firefox console will complain about XML parse errors if it is not
    // valid.
    req.open("GET", "example/data.txt", false);
    req.send(null);
    console.log(req.responseText);
});

$('#get2').click(function(ev) {
    ev.preventDefault();
    var req = new XMLHttpRequest();
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/overrideMimeType
    req.overrideMimeType("text/plain");
    req.open("GET", "example/data_text.txt", false);
    req.send(null);
    console.log(req.responseText);
});
   


}); /* $(document).ready */

