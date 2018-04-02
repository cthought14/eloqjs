// nodeAccept. Chapter 20 (Node.js), Exercise 1. Content negotiation, again.
"use strict";

var http = require("http");

/*
var https = require("https");
request = https.request({
    hostname: "www.google.com",
    path: "/about/",
    method: "GET",
    headers: {Accept: "text/html"}
}, function(response) {
    console.log("[https://www.google.com] Server responded with status code",
                response.statusCode);
});
request.end();
*/

/*
...
    response.on("data", function(chunk) {
        if (first) {
            first = false;
            process.stdout.write("[From uppercase_server] ");
        }
        process.stdout.write(chunk.toString());
    });
...
*/

var request;

function makeRequest(url, type) {
    // ...
}

// http://eloquentjavascript.net/author
request = http.request({
    hostname: "eloquentjavascript.net",
    path: "/author",
    method: "GET",
    headers: {Accept: "text/plain"}
}, function(response) {
    console.log("[http://eloquentjavascript.net/author text/plain] ", response.statusCode);
    response.on("data", function(chunk) {
        process.stdout.write(chunk.toString());
    });
});
request.end();

