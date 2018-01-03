// flatten. Chapter 5, Exercise 1. Flattening.
"use strict";

function flatten(a) {
    if (a.length == 1) {
        if (typeof a[0] != "object") {
            // => a[0] is scalar.
            return [a[0]];
        }
        else {
            // => a[0] is Array.
            return flatten(a[0]);
        }
    }
    if (typeof a[0] != "object")
        return [a[0]].concat(flatten(a.slice(1)));
    else
        return flatten(a[0]).concat(flatten(a.slice(1)));
}

expect(flatten([1,[2,3]]), [1,2,3]);
expect(flatten([2,4]), [2,4]);
expect(flatten([3,6,9]), [3,6,9]);
expect(flatten([3,6,[9,[1,-12]]]), [3,6,9,1,-12]);
expect(flatten([[[-1,-12],9],3,6]), [-1,-12,9,3,6]);
