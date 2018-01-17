// regexpGolf. Chapter 9, Exercise 1. Regexp golf.
"use strict";

function _tryRe(re, testString, testResult) {
    expect(re.test(testString), testResult);
}

var re;
console.log("1.");
re = /car|t/;
_tryRe(re, "a car and a", true);
_tryRe(re, "and a cat", true);
_tryRe(re, "a car and a cat", true);
_tryRe(re, "a cax and a caT", false);    

console.log("2.");
re = /pr?op/;
_tryRe(re, "a pop and a ", true);
_tryRe(re, "and a prop", true);
_tryRe(re, "a pop and a prop", true);
_tryRe(re, "a poop and a prom", false);

console.log("3.");
re = /ferret|ferry|ferrari/;
re = /ferr(et|y|ari)/;
_tryRe(re, "a ferret and a ", true);
_tryRe(re, "and a ferry", true);
_tryRe(re, "and a ferrari", true);
_tryRe(re, "a ferret and a ferry and a ferrari", true);
_tryRe(re, "a ferres and a ferri and a ferrary", false);

console.log("4.");
re = /\b.+ious\b/;
re = /ious\b/;
_tryRe(re, "delicious", true);
_tryRe(re, "deliciouss", false);
_tryRe(re, "delicous", false);

console.log("5.");
re = /\s[.,:;]/;
_tryRe(re, " .", true);
_tryRe(re, " ;", true);
_tryRe(re, "\n.", true);
_tryRe(re, "\t;", true);
_tryRe(re, ".", false);
_tryRe(re, ";", false);

console.log("6.");
re = /\w{7,}/;
_tryRe(re, "expeditious", true);
_tryRe(re, "  expeditious", true);
_tryRe(re, "adventure", true);
_tryRe(re, "  adventure", true);
_tryRe(re, "advent", false);
_tryRe(re, "  advent", false);

console.log("7.");
re = /\b[^e]+\b/;
_tryRe(re, ".eliminate", false);
_tryRe(re, "abate", false);
_tryRe(re, "..xylophonic..", true);
_tryRe(re, "the xylophonic elephant ate the eel", true);
