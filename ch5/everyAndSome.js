// everyAndSome. Chapter 5, Exercise 4. Every and then some.
"use strict";
var ancestry = JSON.parse(ANCESTRY_FILE);

function every(arr, pred) { 
    var ret = true;
    arr.forEach(function(elem) {
        if (!pred(elem)) ret = false;
    });
    return ret;
}

var a1 = [2, 4, 6, 8, 10];
expect(a1.every(function(n) { return n % 2 == 0; }), true);
expect(every(a1, function(n) { return n % 2 == 0; }), true);
var a2 = [2, 5, 6, 8, 10];
expect(a2.every(function(n) { return n % 2 == 0; }), false);
expect(every(a2, function(n) { return n % 2 == 0; }), false);

function some(arr, pred) {
    var ret = false;
    arr.forEach(function(elem) {
        if (pred(elem)) ret = true;
    });
    return ret;
}

var a3 = [4, 9, 3, 6, 99, 23, 100, 75];
expect(a3.some(function(n) { return n > 99; }), true);
expect(some(a3, function(n) { return n > 99; }), true);
var a4 = [4, 9, 3, 6, 99, 23, 99, 75];
expect(a4.some(function(n) { return n > 99; }), false);
expect(some(a4, function(n) { return n > 99; }), false);

expect(ancestry.every(function(p) { return p.sex == "m" || p.sex == "f"; }), true);
expect(every(ancestry, function(p) { return p.sex == "m" || p.sex == "f"; }), true);
function contains(s, t) { return s.search(t) != -1; }
expect(ancestry.some(function(p) { return contains(p.name, "Haverbeke"); }), true);
expect(some(ancestry, function(p) { return contains(p.name, "Haverbeke"); }), true);
