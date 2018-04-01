// Chapter 20 (Node.js)
"use strict";

// TODO

/*
var http = require("http");
var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    request.on("data", function(chunk) {
        response.write(chunk.toString().toUpperCase());
    });
    request.on("end", function() {
        response.end();
    });
});
server.listen(8000);
*/

var http = require("http"),
    fs = require("fs");
var methods = Object.create(null);

function createServer() {
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
    }).listen(8000);
}

var url = require("url");

function urlToPath(url) {
    var path = url.parse(url).pathname;
    return "." + decodeURIComponent(path);
}

var mime = require("mime");

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



        
    
    
    
    
    
    
    
    
    
    
    
    
    
    