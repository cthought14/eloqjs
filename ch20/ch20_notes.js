// Chapter 20 (Node.js)
"use strict";

/////
/////

var testutil = {};

function expect(observed, expected) {
    if (typeof expect.counter == 'undefined' ) 
        expect.counter = 0;

    // deepEqual_toString(a, b)
    // --- Modified version of deepEqual() from ch4.
    var deepEqual_toString = (function (a, b) {
        if (a !== null && typeof a == 'object' && 
            b !== null && typeof b == 'object')
            // => Need deep comparison.
        {
            for (var prop in a) {
                if (!(prop in b))
                    return false;
                if (!deepEqual_toString(a[prop], b[prop]))
                    return false;
            }
            return true;
        }
        if (a === null || b === null) 
            return a === null && b === null;
        return a.toString() == b.toString();
    });
        
    var out = "";
    var silent = ("silent" in testutil && !!testutil.silent);    
    if (!silent)
        out += (++expect.counter).toString() + ": ";
    
    var mismatch = false;
    if (typeof observed == 'undefined' && 
        typeof expected == 'undefined') 
    {
        out += "[OK] ";
    }
    else if (typeof observed != 'undefined' && 
            (deepEqual_toString(observed, expected)))
    {
        out += "[OK] ";
    }
    else {
        out += "[??] ";
        mismatch = true;
    }
    
    if (observed === null)
        out += "null";
    else if (typeof observed != 'undefined')
        out += observed.toString();
    else
        out += "undefined";
    if (mismatch) {
        out += " (Expected: ";
        if (expected === null)
            out += "null";
        else if (typeof expected != 'undefined') {
            out += expected.toString();
        }
        else
            out += "undefined";
        out += ")";
    }

    if (!mismatch && !silent)
        console.log(out);
    else if (!mismatch && silent)
        ;
    else
        console.warn(out);
}

function tprint(message) {
    var silent = ("silent" in testutil && !!testutil.silent);    
    if (!silent)
        console.log(message);
}

/////
/////


//
// 388
//
tprint("### 388 Background");

//
// 389
//
tprint("### 389 Asynchronicity");

//
// 390
//
tprint("### 390 The node command");

expect([-1, -2, -3].map(Math.abs), "1,2,3");

//
// 392
// 
tprint("### 392 Modules");

// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
var child_process = require('child_process');
child_process.exec("node main.js JavaScript", function(error, stdout, stderr) {
    console.log("stdout:", stdout);
});

//
// 393
//
tprint("### 393 Installing with NPM");

var figlet = require("figlet");
figlet.text("Hello, world!", function(error, data) {
    if (error)
        console.error(error);
    else
        console.log(data);
});

//
// 394
//
tprint("### 394 The file system module");
var fs = require("fs");
fs.readFile("file.txt", "utf8", function(error, text) {
    if (error)
        throw error;
    console.log("file.txt:", text);
});

fs.readFile("binary.dat", function(error, buffer) {
    if (error)
        throw error;
    console.log("binary.dat,", buffer.length, "bytes:", buffer[0], "...");
});

fs.writeFile("graffiti.txt", "Node was here\n", function(err) {
    if (err)
        console.error("graffiti.txt: Failed to write file:", err);
    else
        console.log("graffiti.txt: File written.");
});

console.log("[readFileSync] file.txt:", fs.readFileSync("file.txt", "utf8"));

//
// 396
//

// See: server.js

var request;
var http = require("http");
request = http.request({
    hostname: "localhost",
    port: 8000,
    path: "/20_node.html",
    method: "GET",
    headers: {Accept: "text/html"}
}, function(response) {
    console.log("[localhost:8000] Server responded with status code",
                response.statusCode);
});
request.end();

var http = require("http");
request = http.request({
    hostname: "eloquentjavascript.net",
    path: "/20_node.html",
    method: "GET",
    headers: {Accept: "text/html"}
}, function(response) {
    console.log("[eloquentjavascript.net] Server responded with status code",
                response.statusCode);
});
request.end();

//https://www.google.com/about/

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

//
// 398
//
tprint("### 398 Streams");

// See: uppercase_server.js

request = http.request({
    hostname: "localhost",
    port: 8000,
    method: "POST"
}, function(response) {
    var first = true;
    response.on("data", function(chunk) {
        if (first) {
            first = false;
            process.stdout.write("[From uppercase_server] ");
        }
        process.stdout.write(chunk.toString());
    });
});
request.end("Hello server\n");

//
// 400
//
tprint("### 400 A simple file server");

// See: file_server.js

//
// 405
//
tprint("### 405 Error handling");

// See: file_server_promises.js

//
// 407
//
tprint("### 407 Summary");

