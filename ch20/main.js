// Chapter 20 (Node.js)
"use strict";

//
// 392
//
var garble = require("./garble");

// Command-line usage: node main.js ARGUMENT
var argument = process.argv[2];

console.log(garble(argument));
