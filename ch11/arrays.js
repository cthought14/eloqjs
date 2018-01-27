// arrays. Chapter 11, Exercise 1. Arrays.
"use strict";

run; // From ch11_notes.js

tprint("## arrays.js");
tprint("### Exercise 1. Arrays.");

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
        define(a1, array(11, 22, 33, 44, 55, 66, 77, 88, 99)), \
        define(i, 0), \
        while(<(i, length(a1)), do( \
            print(element(a1, i)), \
            define(i, +(i, 1)) \
        )) \
    ) \
");

