// Chapter 20 (Node.js)
"use strict";

// Example usage as client:
/***

$ curl -s -S http://localhost:8000/file.txt
--- Begin file.txt ---
This is the contents of file.txt.
--- End file.txt ---

$ curl -s -S http://localhost:8000/file__NOTFOUND.txt
File not found

$ curl -s -S -X PUT -d hello1 http://localhost:8000/file1.txt

$ curl -s -S http://localhost:8000/file1.txt
hello1

$ curl -s -S -X DELETE http://localhost:8000/file1.txt

$ curl -s -S http://localhost:8000/file1.txt
File not found

***/

var http = require("http"),
    fs = require("fs");
var methods = Object.create(null);

var url = require("url");

var mime = require("mime");
mime.lookup = function(path) { return this.getType(path); }
mime.extension = function(path) { return this.getExtension(path); }

function createServer(port) {
    if (typeof port == "undefined") port = 8000;
    http.createServer(function(request, response) {
        function respond(code, body, type) {
            if (!type)
                type = "text/plain";
            response.writeHead(code, {"Content-Type": type});
            if (body && body.pipe)
                body.pipe(response);
            else
                response.end(body);
        }
        if (request.method in methods)
            methods[request.method](urlToPath(request.url),
                        respond, request);
        else
            respond(405, "Method " + request.method + " not allowed.");
    }).listen(port);
}

function urlToPath(theUrl) {
    var path = url.parse(theUrl).pathname;
    return "." + decodeURIComponent(path);
}

methods.GET = function(path, respond) {
    fs.stat(path, function(error, stats) {
        if (error && error.code == "ENOENT")
            respond(404, "File not found");
        else if (error)
            respond(500, error.toString());
        else if (stats.isDirectory())
            fs.readdir(path, function(error, files) {
                if (error)
                    respond(500, error.toString());
                else
                    respond(200, files.join("\n"));
            });
        else
            respond(200, fs.createReadStream(path),
                    mime.lookup(path));
    });
};

methods.DELETE = function(path, respond) {
    fs.stat(path, function(error, stats) {
        if (error && error.code == "ENOENT")
            respond(204); // 204: Request is already fulfilled.
        else if (error)
            respond(500, error.toString());
        else if (stats.isDirectory())
            fs.rmdir(path, respondErrorOrNothing(respond));
        else
            fs.unlink(path, respondErrorOrNothing(respond));
    });
};

function respondErrorOrNothing(respond) {
    return function(error) {
        if (error)  
            respond(500, error.toString());
        else
            respond(204);
    }
}

methods.PUT = function(path, respond, request) {
    var outStream = fs.createWriteStream(path);
    outStream.on("error", function(error) {
        respond(500, error.toString());
    });
    outStream.on("finish", function() {
        respond(204);
    });
    request.pipe(outStream);
}

if (1) (function() {
    var port = 8000;
    console.log("Starting server on port " + port + " ...");
    createServer(port);
})();

if (0) (function() {
    var x = urlToPath("http://www.blah.com/foo/bar/baz");
    console.log(x);
})();

if (0) (function() {
    var path = urlToPath("http://www.blah.com/foo/bar/baz.jpg");
    //console.log(path);
    
    var mime = require("mime");
    //console.log(mime);
    var y = mime.lookup(path);
    console.log(y);
})();

