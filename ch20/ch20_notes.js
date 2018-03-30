// Chapter 20 (Node.js)
"use strict";

/////
/////

var testutil = {};

function expect(observed, expected) {
    if (typeof expect.counter == 'undefined' ) 
        expect.counter = 0;

    // deepEqual_toString(a, b)
    // --- Modified version of deepEqual() from ch4.
    var deepEqual_toString = (function (a, b) {
        if (a !== null && typeof a == 'object' && 
            b !== null && typeof b == 'object')
            // => Need deep comparison.
        {
            for (var prop in a) {
                if (!(prop in b))
                    return false;
                if (!deepEqual_toString(a[prop], b[prop]))
                    return false;
            }
            return true;
        }
        if (a === null || b === null) 
            return a === null && b === null;
        return a.toString() == b.toString();
    });
        
    var out = "";
    var silent = ("silent" in testutil && !!testutil.silent);    
    if (!silent)
        out += (++expect.counter).toString() + ": ";
    
    var mismatch = false;
    if (typeof observed == 'undefined' && 
        typeof expected == 'undefined') 
    {
        out += "[OK] ";
    }
    else if (typeof observed != 'undefined' && 
            (deepEqual_toString(observed, expected)))
    {
        out += "[OK] ";
    }
    else {
        out += "[??] ";
        mismatch = true;
    }
    
    if (observed === null)
        out += "null";
    else if (typeof observed != 'undefined')
        out += observed.toString();
    else
        out += "undefined";
    if (mismatch) {
        out += " (Expected: ";
        if (expected === null)
            out += "null";
        else if (typeof expected != 'undefined') {
            out += expected.toString();
        }
        else
            out += "undefined";
        out += ")";
    }

    if (!mismatch && !silent)
        console.log(out);
    else if (!mismatch && silent)
        ;
    else
        console.warn(out);
}

function tprint(message) {
    var silent = ("silent" in testutil && !!testutil.silent);    
    if (!silent)
        console.log(message);
}

/////
/////


//
// 388
//
tprint("### 388 Background");

//
// 389
//
tprint("### 389 Asynchronicity");

//
// 390
//
tprint("### 390 The node command");

expect([-1, -2, -3].map(Math.abs), "1,2,3");

//
// 392
// 
tprint("### 392 Modules");

// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
var child_process = require('child_process');
child_process.exec("node main.js JavaScript", function(error, stdout, stderr) {
    console.log("stdout:", stdout);
});

//
// 393
//
tprint("### 393 Installing with NPM");


