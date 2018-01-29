// Chapter 13.
"use strict";

$(document).ready(function() {

//
// 241
//
tprint("### Document structure");

//
// 242
//
tprint("### Trees");

//
// 244
//
tprint("### The standard");

function forEach(collection, fn) {
    for (var i = 0; i < collection.length; i++) {
        fn(collection[i]);
    }
}
        
// "childNodes is an instance of the NodeList type, not a real array,
// so it does not have methods such as slice and forEach."
// --Q: Then why does the following work?
/*
document.body.childNodes.forEach(function(node) {
    console.log(node.nodeType);
});
*/

// Alternative, not using forEach.
forEach(document.body.childNodes, function(node) {
    switch(node.nodeType) {
    case document.ELEMENT_NODE: 
        console.log("ELEMENT_NODE (" + node.nodeName + ")");
        break;
    case document.TEXT_NODE:
        console.log("TEXT_NODE \"" + node.nodeValue.trim() + "\"");
        break;
    default:
        console.log(node.nodeType);
    }
});

//
// 245
//
tprint("### Moving about the tree");

function talksAbout(node, string) {
    if (node.nodeType == document.ELEMENT_NODE) {
        for (var i = 0; i < node.childNodes.length; i++) {
            if (talksAbout(node.childNodes[i], string))
                return true;
        }
        return false;
    }
    else if (node.nodeType == document.TEXT_NODE) {
        return node.nodeValue.indexOf(string) > -1;
    }
}

expect(talksAbout(document.body, "a book"), true);
expect(talksAbout(document.body, "wrote a book"), false);

//
// 246
//
tprint("### Finding elements");        
forEach(document.body.getElementsByTagName("a"), function(node) {
    console.log(node.href);
});

var ostrich1 = document.getElementById("ostrich1");
console.log(ostrich1.src);
expect(contains(ostrich1.src, "ostrich_300px.png"), true);

function contains(s, t) { 
    return s.indexOf(t) != -1;
}

forEach(document.body.getElementsByClassName("WikiLink"), function(node) {
    console.log(node.href);
});

//
// 247
//
tprint("### Changing the document");


///////////////////////////

}); /* $(document).ready */