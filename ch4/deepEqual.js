// deepEqual. Chapter 4, Exercise 4. Deep comparison.
"use strict";

function deepEqual(a, b) {
    if (a !== null && typeof a == 'object' && 
        b !== null && typeof b == 'object')
        // => Need deep comparison.
    {
        for (var prop in a) {
            if (!(prop in b))
                return false;
            if (!deepEqual(a[prop], b[prop]))
                return false;
        }
        return true;
    }
    return a == b;
}

var i1 = 123;
var i1_copy = 123;
var i2 = 234;
expect(deepEqual(i1, i1_copy), true);
expect(deepEqual(i1, i1_copy), true);
expect(deepEqual(i1, i2), false);
expect(deepEqual(i1, null), false);
expect(deepEqual(i1_copy, null), false);
expect(deepEqual(i2, null), false);
expect(deepEqual(null, null), true);

var o1 = {x: 20, y: 40};
var o1_copy = {x: 20, y: 40};
var o2 = {x: 99, y: -27};
expect(deepEqual(o1, o1_copy), true);
expect(deepEqual(o1, o2), false);
expect(deepEqual(o1, null), false);
expect(deepEqual(null, o1_copy), false);
expect(deepEqual(o2, null), false);

var oo1 =       {p1: {x:20, y:40}, p2: o1};
var oo1_copy =  {p1: {y:40, x:20}, p2: o1_copy};
var oo2 =       {p1: {x:99, y:-27}, p2: o1_copy};
var oo3 =       {p1: {x:20, y:42}, p2: o1};
expect(deepEqual(oo1, oo1_copy), true);
expect(deepEqual(oo1, oo2), false);
expect(deepEqual(oo1, oo3), false);
expect(deepEqual(oo1, null), false);
expect(deepEqual(null, oo1_copy), false);
expect(deepEqual(oo2, null), false);
expect(deepEqual(null, oo3), false);
