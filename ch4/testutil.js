"use strict";

function expect(observed, expected) {
    if (typeof expect.counter == 'undefined' ) 
        expect.counter = 0;

    var out = "";
    out += (++expect.counter).toString() + ": ";
    
    if (observed.toString() == expected.toString()) {
        out += "[OK] ";
    }
    else {
        out += "[??] ";
    }
    out += expected.toString();
    console.log(out);
}
