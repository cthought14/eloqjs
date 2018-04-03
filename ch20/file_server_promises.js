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
        return methods[request.method](urlToPath(request.url), request);
    else
        return Promise.resolve({code: 405,
                                body: "Method " + request.method + " not allowed."});
}

function urlToPath(theUrl) {
    var path = url.parse(theUrl).pathname;
    var ret = "." + decodeURIComponent(path);
    // Exercise 2: Disallow ".." components.
    var dodgy = /(^|[\/\\])\.\.([\/\\]|$)/; 
    if (dodgy.exec(ret))
        return null;
    //console.log("urlToPath: " + ret.toString());
    return ret;
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

methods.GET = function(path) {
    return inspectPath(path).then(function(stats) {
        if (!stats)
            return {code: 404, body: "File not found"};
        else if (stats.isDirectory())
            return fsp.readdir(path).then(function(files) {
                return {code: 200, body: files.join("\n")};
            });
        else
            return {code: 200,
                    type: mime.lookup(path),
                    body: fs.createReadStream(path)};
    });
};

var noContent = {code: 204}; // 204: Request is already fulfilled.
function returnNoContent() { return noContent; }

methods.DELETE = function(path) {
    return inspectPath(path).then(function(stats) {
        if (!stats)
            return noContent;
        else if (stats.isDirectory())
            return fsp.rmdir(path).then(returnNoContent);
        else
            return fsp.unlink(path).then(returnNoContent);
    });
};

methods.PUT = function(path, request) {
    return new Promise(function(success, failure) {
        var outStream = fs.createWriteStream(path);
        outStream.on("error", failure);
        outStream.on("finish", success.bind(null, noContent));
        request.pipe(outStream);
    });
};

/*
methods.MKCOL = function(path, request) {
    // ...
}
*/

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
    var z = mime.extension("image/gif");
    console.log(z);
})();

if (1) (function() {
    var port = 8000;
    console.log("Starting server on port " + port + " ...");
    createServer(port);
})();


