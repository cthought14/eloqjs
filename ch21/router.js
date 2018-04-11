// Chapter 21 (Project: Skill-sharing Website)
// router.js
"use strict";

var url = require("url");

// Router
// --------------------------
// add(method, url, handler)
// resolve(request, response)

var Router = module.exports = function() {
    this.routes = [];
};

Router.prototype.add = function(method, theUrl, handler) {
    this.routes.push(
        {method: method,
         url: theUrl,
         handler: handler});
};

Router.prototype.resolve = function(request, response) {
    var path = url.parse(request.url).pathname;
    
    return this.routes.some(function(route) {
        var match = route.url.exec(path);
        if (!match || route.method != request.method)
            return false;
        
        var urlParts = match.slice(1).map(decodeURIComponent);
        route.handler.apply(null, 
                    [request, response].concat(urlParts)); // handler(request, response, urlParts...);
        return true;
    });
};

Router.prototype.sayHi = function() {
    return "Greetings from Router.";
};

