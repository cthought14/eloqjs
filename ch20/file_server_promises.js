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
    fs = require("fs"),
    Promise = require("promise");
var methods = Object.create(null);

var url = require("url");

var mime = require("mime");
mime.lookup = function(path) { return this.getType(path); };
mime.extension = function(type) { return this.getExtension(type); };

function createServer(port) {
    if (typeof port == "undefined") port = 8000;
    http.createServer(function(request, response) {
        respondTo(request).then(function(data) {
            if (!data.type)
                data.type = "text/plain";
            response.writeHead(data.code, {"Content-Type": data.type});
            if (data.body && data.body.pipe)
                data.body.pipe(response);
            else
                response.end(data.body);
        }, 
        function(error) {
            response.writeHead(500);
            response.end(error.toString());
            console.log("Response failed: ", error.stack);
        });
    }).listen(port);
}

function respondTo(request) {
    if (request.method in methods)
        return method[request.method](urlToPath(request.url), request);
    else
        return Promise.resolve({code: 405,
                                body: "Method " + request.method + " not allowed."});
}

function urlToPath(theUrl) {
    var path = url.parse(theUrl).pathname;
    return "." + decodeURIComponent(path);
}

var fsp = {};
["stat", "readdir", "rmdir", "unlink", "mkdir"].forEach(function(method) {
    fsp[method] = Promise.denodeify(fs[method]);
});

function inspectPath(path) {
    // Returning null for the success handler lets through normal 
    // successes unchanged.
    return fsp.stat(path).then(null, function(error) {
        if (error.code == "ENOENT") 
            return null;
        else
            throw error;
    });
}

// TODO



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

if (0) (function() {
    var x = urlToPath("http://www.blah.com/foo/bar/baz");
    console.log(x);
})();

if (1) (function() {
    var path = urlToPath("http://www.blah.com/foo/bar/baz.jpg");
    //console.log(path);
    
    var mime = require("mime");
    //console.log(mime);
    var y = mime.lookup(path);
    console.log(y);
    var z = mime.extension("image/gif");
    console.log(z);
})();

if (1) (function() {
    var port = 8000;
    console.log("Starting server on port " + port + " ...");
    createServer(port);
})();


