// require. Chapter 10, Exercise 3. Circular dependencies.
"use strict";

function require(name) {
    if (typeof require.cache == 'undefined' ) 
        require.cache = Object.create(null);
    if (name in require.cache)
        return require.cache[name];
        
    var code = new Function("exports, module", readFile(name));
    var exports = {}, module = {exports: exports};
    code(exports, module);
    
    require.cache[name] = module.exports;
    return module.exports;
}

// TODO - Circular dependencies do not work.
function readFile(name) {
    console.log(">>> readFile()");
    if (name == "weekDay") 
        return "\
var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',\n\
             'Thursday', 'Friday', 'Saturday'];\n\
var mod_names = require('names');\n\
\n\
exports.name = function(number) { return mod_names.names[number]; };\n\
exports.number = function(name) { return mod_names.names.indexOf(name); };\n\
//exports._names = names;\n\
";
    else if (name == "names")
        return "\
var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',\n\
             'Thursday', 'Friday', 'Saturday'];\n\
//var mod_weekDay = require('weekday');\n\
\n\
//exports.names = mod_weekDay._names;\n\
exports.names = names;\n\
";
    
}

var weekDay = require("weekDay");

expect(weekDay.name(1), "Monday");
expect(weekDay.name(2), "Tuesday");
