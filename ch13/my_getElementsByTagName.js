// my_getElementsByTagName. Chapter 13, Exercise 2. Elements by tag name.
"use strict";

function forEach(collection, fn) {
    for (var i = 0; i < collection.length; i++) {
        fn(collection[i], i);
    }
}

function strcmp(s, t) {
    return s == t ? 0 : s > t ? 1 : -1;
}

function strcasecmp(s, t) {
    return strcmp(s.toLowerCase(), t.toLowerCase());
}

function my_getElementsByTagName(node, tagName) {
    var elements = new Array();
    
    function walk(node, tagName) {
        if (node.nodeType == document.ELEMENT_NODE) {
            if (!strcasecmp(node.tagName, tagName))
                elements.push(node);
            forEach(node.childNodes, function(child) {
                walk(child, tagName);
            })
        }
    }
    walk(node, tagName);
    return elements;
}

////
////

$(document).ready(function() {

console.log("### getElementsByTagName, \"h3\"");
var matches_h3 = document.body.getElementsByTagName("h3");
_verifyMatches(matches_h3);

console.log("### getElementsByTagName, \"H3\"");
var matches_H3 = document.body.getElementsByTagName("H3");
_verifyMatches(matches_H3);

console.log("### my_getElementsByTagName, \"h3\"");
var my_matches_h3 = my_getElementsByTagName(document.body, "h3");
_verifyMatches(my_matches_h3);

console.log("### my_getElementsByTagName, \"H3\"");
var my_matches_H3 = my_getElementsByTagName(document.body, "H3");
_verifyMatches(my_matches_H3);

function _verifyMatches(matches) {
    expect(matches.length, 3);
    forEach(matches, function(node, i) {
        if (i == 0) expect(node.textContent, "A level 3 heading");
        else if (i == 1) expect(node.textContent, "Another level 3 heading");
        else if (i == 2) expect(node.textContent, "Yet another level 3 heading");    
    });
}

}); /* $(document).ready */
