"use strict";

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
    
    if (typeof observed != 'undefined')
        out += observed.toString();
    else
        out += "undefined";
    if (mismatch) {
        out += " (Expected: ";
        if (typeof expected != 'undefined')
            out += expected.toString();
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
