// reverse. Chapter 4, Exercise 2. Reversing an array.
"use strict";

function reverseArray(arr) {
    var revArr = [];
    for (var i = arr.length-1; i >= 0; i--) {
        revArr.push(arr[i]);
    }
    return revArr;
}

function reverseArrayInPlace(arr) {
    // parseInt => Truncate result to integer.
    var mid = parseInt(arr.length/2)
    var end = arr.length-1;
    for (var i = 0; i < mid; i++) {
        // Swap arr[i] and arr[end-i].
        var x = arr[i];
        arr[i] = arr[end-i];
        arr[end-i] = x;
    }
    return arr;
}

expect(reverseArray([0]), [0]);
expect(reverseArray([1,2,3]), [3,2,1]);
expect(reverseArray([1,2,3,4]), [4,3,2,1]);
expect(reverseArray([]), []);

var a0 = [0];
reverseArrayInPlace(a0);
expect(a0, [0]);

var a1 = [4,5,6];
reverseArrayInPlace(a1);
expect(a1, [6,5,4]);

var a2 = [4,5,6,7];
reverseArrayInPlace(a2);
expect(a2, [7,6,5,4]);

var a3 = [];
reverseArrayInPlace(a3);
expect(a3, []);
