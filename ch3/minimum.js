// minimum. Chapter 3, Exercise 1. Minimum.
"use strict";

function min() {
    // See p.79. The arguments object.
    //assert(arguments.length >= 1);
    var low = arguments[0];
    
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] < low)
            low = arguments[i];
    }
    return low;
}

expect(min(9,999), 9);
expect(min(-9,-999), -999);
expect(min(0,1,2), 0);
expect(min(2,1,0), 0);
expect(min(-2,-1,0), -2);
expect(min(0,-1,-2), -2);
