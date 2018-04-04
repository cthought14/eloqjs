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

$ curl -s -S http://localhost:8000/files/%2e%2e/%2e%2e/etc/passwd
Forbidden

$ curl -s -S http://localhost:8000/files/%2e%2e/files/a.txt
Forbidden

--Q: Why is this allowed by curl (does curl translate the /../ component?)

$ curl -s -S http://localhost:8000/files/../files/a.txt
---
This is a.txt.
---

# Exercise 3 - success case (should return 204)

$ rm dir1
$ mkdir -p dir1 && rmdir dir1 && curl -s -S -X MKCOL http://localhost:8000/dir1 -I

# Exercise 3 - error case 1 - directory already exists (should return 204)

$ rm dir1
$ mkdir -p dir1 && curl -s -S -X MKCOL http://localhost:8000/dir1 -I

# Exercise 3 - error case 2 - exists but it is not a directory (should return 403)

$ rmdir dir1
$ rm -f dir1 && mkdir -p dir1 && rmdir dir1 && touch dir1 && curl -s -S -X MKCOL http://localhost:8000/dir1 -I

***/

var http = require("http"),
    fs = require("fs");
var methods = Object.create(null);

var url = require("url");

var mime = require("mime");
mime.lookup = function(path) { return this.getType(path); };
mime.extension = function(type) { return this.getExtension(type); };

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
    var ret = "." + decodeURIComponent(path);
    // Exercise 2: Disallow ".." components.
    var dodgy = /(^|[\/\\])\.\.([\/\\]|$)/; 
    if (dodgy.exec(ret))
        return null;
    //console.log("urlToPath: " + ret.toString());
    return ret;
}

methods.GET = function(path, respond) {
    if (!path) {
        respond(403, "Forbidden");
        return;
    }
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

// Exercise 3: Add support for MKCOL.
methods.MKCOL = function(path, respond) {
    fs.mkdir(path, function(error) {
        if (error && error.code == "EEXIST") {
            console.log("Exists");
            fs.stat(path, function(error, stats) {
                if (error)
                    respond(409); // 409: Conflict.
                else if (!stats.isDirectory())
                    respond(403);
                else
                    respond(204); // 204: Request is already fulfilled.
            });
        }
        else if (error)
            respond(500, error.toString());
        else
            respond(204);
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

if (0) (function() {
    var respond = function(code, body, type) {
        console.log("Response code " + code.toString());
    };
    //console.log("Trying to remove a directory...");
    //fs.rmdir("my_dir1", respondErrorOrNothing(respond));
    console.log("Trying to make a directory...");
    fs.mkdir("my_dir1", respondErrorOrNothing(respond));
    process.exit(0);
})();


if (1) (function() {
    var port = 8000;
    console.log("Starting server on port " + port + " ...");
    createServer(port);
})();


