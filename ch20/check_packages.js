// Chapter 20 (Node.js)
"use strict";

// npm install mime
var mime = require("mime");
console.log("mime", typeof mime);

var url = require("url");
console.log("url", typeof url);

// npm install promise
var Promise = require("promise");
console.log("Promise", typeof Promise);
console.log("Promise.denodeify", typeof Promise.denodeify);
