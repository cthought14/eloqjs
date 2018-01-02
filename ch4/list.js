// list. Chapter 4, Exercise 3. A list.
"use strict";

function _listLength(list) {
    var len = 0;
    for (var lp = list; lp.rest !== null; lp = lp.rest) {
        len++;
    }
    // Final value.
    if ("value" in list)
        len++;
    return len;
}

function _arrayLength(arr) { return arr.length; }

//
// arrayToList
//

function arrayToList(arr) {    
    var list = {rest: {}};
    var lp = list;
    
    for (var i = 0; i < arr.length - 1; i++) {
        lp.value = arr[i];
        lp.rest = {};
        lp = lp.rest;
    }
    // Final value.
    if (arr.length > 0)
        lp.value = arr[arr.length - 1];
    lp.rest = null;
    return list;
}

var a3 = [1,2,3];
var a2 = [1,2];
var a1 = [1];
var a0 = [];
expect(_listLength(arrayToList(a3)), 3);
expect(_listLength(arrayToList(a2)), 2);
expect(_listLength(arrayToList(a1)), 1);
expect(_listLength(arrayToList(a0)), 0);

//
// listToArray
//

function listToArray(list) {
    var arr = [];
    var lp = list;
    for (; lp.rest !== null; lp = lp.rest) {
        arr.push(lp.value);
    }
    // Final value.
    if ("value" in lp)
        arr.push(lp.value);
    return arr;
}

var l3 = arrayToList(a3);
var l2 = arrayToList(a2);
var l1 = arrayToList(a1);
var l0 = arrayToList(a0);
expect(_arrayLength(listToArray(l3)), 3);
expect(_arrayLength(listToArray(l2)), 2);
expect(_arrayLength(listToArray(l1)), 1);
expect(_arrayLength(listToArray(l0)), 0);

expect(listToArray(arrayToList([3,6,9])), [3,6,9]);
expect(listToArray(arrayToList([11,22,33,44])), [11,22,33,44]);

//
// prepend(elem, list)
//

function prepend(elem, list) {
    return {
        value: elem,
        rest: list
    };
}

expect(listToArray(prepend(999, l3)), [999,1,2,3]);
expect(listToArray(prepend(999, l0)), [999]);

//
// nth(list, n)
//

function nth(list, n) {
    if (list === null)
        return undefined;
    if (n == 0)
        return list.value;
    return nth(list.rest, n-1);
}

expect(undefined, undefined);
expect(nth(l0, 0), undefined);
expect(nth(l3, 0), 1);
expect(nth(l3, 1), 2);
expect(nth(l3, 2), 3);
expect(nth(l3, 3), undefined);
