// arrays. Chapter 11, Exercise 1. Arrays.
"use strict";

run; // From ch11_notes.js

tprint("## arrays.js");
tprint("### Exercise 1. Arrays.");

// array(ELEM1, ELEM2, ...)
topEnv["array"] = function() {
    return Array.prototype.slice.call(arguments, 0);
}

// element(ARR, N)
topEnv["element"] = function(a, n) {
    if (n < 0 || n >= a.length) {
        // Using RangeError so that the JS console prints the message.
        throw new RangeError("Cannot access element " + n + " of array");
    }
    return a[n];
}

// length(ARR)
topEnv["length"] = function(a) {
    return a.length;
}

/*
    a1 = Array(11, 22, 33, 44, 55, 66, 77, 88, 99)
    i = 0
    while (i < a1.length) {
        print(a1[i])
        i = i + 1
    }        
*/
ret = run(" \
    do( \
        define(a, array(11, 22, 33, 44, 55, 66, 77, 88, 99)), \
        define(i, 0), \
        while(<(i, length(a)), do( \
            print(element(a, i)), \
            define(i, +(i, 1)) \
        )) \
    ) \
");
