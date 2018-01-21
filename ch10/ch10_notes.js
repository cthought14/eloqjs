// Chapter 10.
"use strict";
_defineCache // From defineCache.js

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

// today
// -----------------
// dayNumber() : int

var today1 = function() {
    return {
        dayNumber: function() { return new Date().getDay(); },
    };
}();

expect(weekDay1.name(today1.dayNumber()).startsWith(new Date().toString().slice(0,3)), true);

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

// AMD-style (Asynchronous Module Definition) usage of modules 
// "weekDay" and "today".

define(["weekDay", "today"], function(weekDay, today) {    
    expect(weekDay.name(1), "Monday");
    console.log("Today's day number:", today.dayNumber());
    console.log("Today's day name:", weekDay.name(today.dayNumber()));
});


// AMD-style definition of "weekDay". 
// Commented out; it is returned as a string by backgroundReadFile().
/*
define([], function() {
    var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"];
    return {
        name: function(number) { return names[number]; },
        number: function(name) { return names.indexOf(name); }
    };    
});
*/

// AMD-style definition of "today".
// Commented out; it is returned as a string by backgroundReadFile().
/*
define([], function() {
    return {
        dayNumber: function() { return new Date().getDay(); },
    };
});
*/

_defineCache  //var defineCache = Object.create(null);
var currentMod = null;

function getModule(name) {
    //console.log(">>> getModule"); //debugger;
    if (name in _defineCache())  //if (name in defineCache)
        return _defineCache()[name];  //return defineCache[name];
        
    var module = {
        exports: null,
        loaded: false,
        onLoad: [],
    };
    _defineCache(name, module);  //defineCache[name] = module;
    backgroundReadFile(name, function(code) {
        currentMod = module;
        new Function("", code)();
    });
    return module;
}

// Fake definition for backgroundReadFile().

function backgroundReadFile(name, fn) {
    console.log(">>> backgroundReadFile()");
    if (name == "weekDay") {
        var code = "\
define([], function() {\n\
    var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',\n\
                 'Thursday', 'Friday', 'Saturday'];\n\
    return {\n\
        name: function(number) { return names[number]; },\n\
        number: function(name) { return names.indexOf(name); }\n\
    };\n\
});\n\
";
        fn(code);
    }
    else if (name == "today") {
        var code = "\
define([], function() {\n\
    return {\n\
        dayNumber: function() { return new Date().getDay(); },\n\
    };\n\
});\n\
";
        fn(code);    
    }
    else {
        console.warn("Unknown file:",name);
        fn("");
    }
}

// define().

function define(depNames, moduleFunction) {
    //console.log(">>> define"); //debugger;
    var myMod = currentMod;
    var deps = depNames.map(getModule);
    
    deps.forEach(function(mod) {
        if (!mod.loaded)
            mod.onLoad.push(whenDepsLoaded);
    });
    
    function whenDepsLoaded() {
        if (!deps.every(function(m) { return m.loaded; })) {
            // => Some dependency is not yet loaded.
            return;
        }
        var args = deps.map(function(m) { return m.exports; });
        var exports = moduleFunction.apply(null, args);
        if (myMod) {
            myMod.exports = exports;
            myMod.loaded = true;
            myMod.onLoad.forEach(function(f) { f(); });
        }
    }
    whenDepsLoaded();
}

//
// 212
// 
console.log("### Interface design");
console.log("### Predictability");
console.log("### Composability");
console.log("### Layered interfaces");

//
// 214
//
console.log("### End of chapter");
