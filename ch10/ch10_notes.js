// Chapter 10.
"use strict";

//
// 203
//
console.log("### Using functions as namespaces");

var dayName = function() {
    var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"];
    return function(number) {
        return names[number];
    }
}();

expect(dayName(3), "Wednesday");

// IIFE (Immediately Invoked Function Expression)
(function() {
    function square(x) { return x * x; }
    var hundred = 100;
    expect(square(hundred), 10000);
})();

//
// 204
//
console.log("### Objects as interfaces");

// weekDay
// ------------
// name(number)
// number(name)

var weekDay1 = function() {
    var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"];
    return {
        name: function(number) { return names[number]; },
        number: function(name) { return names.indexOf(name); }
    };
}();

expect(weekDay1.number("Sunday"), 0);
expect(weekDay1.name(0), "Sunday");

// "exports" pattern.

(function(exports) {
    var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"];

    exports.name = function(number) { return names[number]; };
    exports.number = function(name) { return names.indexOf(name); };
})(this.weekDay2 = {});

expect(weekDay2.number("Saturday"), 6);
expect(weekDay2.name(6), "Saturday");

//
// 206
//
console.log("### Evaluating data as code");
function evalAndReturnX(code) {
    eval(code);
    return x;
}

// Does not work in Firefox.
//expect(evalAndReturnX("var x = 2"), 2);

var plusOne = new Function("n", "return n + 1;");
expect(plusOne(4), 5);

//
// 207
//
console.log("### Require");

function readFile0(name) {
    return "\
    var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',\n\
                 'Thursday', 'Friday', 'Saturday'];\n\
\n\
    exports.name = function(number) { return names[number]; };\n\
    exports.number = function(name) { return names.indexOf(name); };\n\
";
}

function require0(name) {
    var code = new Function("exports", readFile0(name));
    var exports = {};
    code(exports);
    return exports;
}

expect(require0("weekDay").name(1), "Monday");

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

function readFile(name) {
    console.log(">>> readFile()");
    return "\
    var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',\n\
                 'Thursday', 'Friday', 'Saturday'];\n\
\n\
    exports.name = function(number) { return names[number]; };\n\
    exports.number = function(name) { return names.indexOf(name); };\n\
";
}

expect(require("weekDay").name(1), "Monday");
expect(require("weekDay").name(2), "Tuesday");

//
// 209
//
console.log("### Slow-loading modules");

