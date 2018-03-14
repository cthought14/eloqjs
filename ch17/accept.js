// accept. Chapter 17, Exercise 1. Content negotiation.
"use strict";

$(document).ready(function() {

//
// Exercise 1 - Content negotiation
//
tprint("### Exercise 1 ");

function acceptMimeType(req, type) {
    req.overrideMimeType(type);
    req.setRequestHeader("Accept", type);
}    

function retrieveContent(url, mimeType) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    acceptMimeType(req, mimeType);
    req.send(null);
    if (req.status >= 400)
        return undefined;
    return req.responseText;
}

if(1)(function(){
    function showContentFor(mimeType) {
        var content;
        console.log("--- " + mimeType.toString() + " ---");
        content = retrieveContent("http://eloquentjavascript.net/author", mimeType);
        console.log(content);
    }
    
    showContentFor("text/plain");
    showContentFor("text/html");
    showContentFor("application/json");
    showContentFor("application/rainbows+unicorns");
    showContentFor("application/x-rainbows+unicorns");
})();
    
}); /* $(document).ready */
