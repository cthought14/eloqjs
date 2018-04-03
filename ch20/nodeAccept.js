// nodeAccept. Chapter 20 (Node.js), Exercise 1. Content negotiation, again.
"use strict";

var http = require("http");

function splitUrl(theUrl) {
    var a = theUrl.indexOf("//");
    var s2 = theUrl.substr(a+2);
    var b = s2.indexOf("/");
    return {
        hostname: s2.substr(0,b),
        path: s2.substr(b)
    }
}

function makeRequest(theUrl, type) {
    var surl = splitUrl(theUrl);
    var request = http.request({
        hostname: surl.hostname,
        path: surl.path,
        method: "GET",
        headers: {Accept: type}
    }, function(response) {
        console.log("["+theUrl.toString()+" "+type.toString()+"] ", response.statusCode);
        response.on("data", function(chunk) {
            process.stdout.write(chunk.toString());
        });
    });
    request.end();
}

// --Q: How do I force the output of these calls comes out in a 
// certain order?
makeRequest("http://eloquentjavascript.net/author", "text/plain");
makeRequest("http://eloquentjavascript.net/author", "text/html");
makeRequest("http://eloquentjavascript.net/author", "application/json");
