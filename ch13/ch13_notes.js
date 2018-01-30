// Chapter 13.
"use strict";
decodeEntities // From decodeEntities.js

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

}); /* $(document).ready */

function forEach(collection, fn) {
    for (var i = 0; i < collection.length; i++) {
        fn(collection[i]);
    }
}

$(document).ready(function() {
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
    case document.ELEMENT_NODE:  // Type 1
        console.log("ELEMENT_NODE (" + node.nodeName + ")");
        break;
    case document.TEXT_NODE: // Type 3
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
var paragraphs = document.body.getElementsByTagName("p");
document.body.insertBefore(paragraphs[7], paragraphs[5]);

//
// 248
//
tprint("### Creating nodes");
}); /* $(document).ready */

function replaceImages() {
    var images = document.body.getElementsByTagName("img");
    for (var i = images.length - 1; i >= 0; i--) {
        var image = images[i];
        if (image.alt) {
            var text = document.createTextNode(image.alt);
            image.parentNode.replaceChild(text, image);
        }
    }
}

$(document).ready(function() {

var img_arrayish = document.body.getElementsByTagName("img");
var img_real = Array.prototype.slice.call(img_arrayish, 0);

$("#logButton").click(function(ev) {
    ev.preventDefault();
    forEach(img_real, function(elt) { 
        console.log(elt);
    });
});    

// elt(type, child1, child2, ...)
function elt(type) {
    var node = document.createElement(type);
    for (var i = 1; i < arguments.length; i++) {
        var child = arguments[i];
        if (typeof child == "string")
            child = document.createTextNode(child);
        node.appendChild(child);
    }
    return node;
}

document.getElementById("quote").appendChild(
    elt("footer", 
        decodeEntities("&mdash;"), 
        elt("strong", "Karl Popper"),
        ", preface to the second edition of ",
        elt("em", "The Open Society and Its Enemies"),
        ", 1950"
    )
);

//
// 250
//
tprint("### Attributes");

$("#concealButton").click(function(ev) {
    ev.preventDefault();
    var paras = document.body.getElementsByTagName("p");
    forEach(paras, function(para) {
        if (para.getAttribute("data-classified") == "secret")
            para.parentNode.removeChild(para);
    });
});

////
////

// highlightCode(
//          node : "A <pre> element", 
//          keywords : "A RegEx with /g turned on"
// )        
function highlightCode(node, keywords) {
    var text = node.textContent;
    node.textContent = "";
    
    var match, pos = 0;
    // Example keywords: /\b(function|return|var)\b/g
    while ((match = keywords.exec(text)) !== null) {
        var before = text.slice(pos, match.index);
        // "... before text ... <strong> ... match text ... </strong> ..."
        node.appendChild(document.createTextNode(before));
        var strong = document.createElement("strong");
        strong.appendChild(document.createTextNode(match[0]));
        node.appendChild(strong);
        pos = keywords.lastIndex;
    }
    var after = text.slice(pos);
    node.appendChild(document.createTextNode(after));
}

var languages = {
    javascript: /\b(function|return|var|for|console|document|Array)\b/g,
    c: /(\b(void|char|while|if|return|int|isspace|memmove|printf)\b|#include\b)/g,
};

function highlightAllCode() {
    var pres = document.body.getElementsByTagName("pre");
    forEach(pres, function(pre) {
        var lang = pre.getAttribute("data-language");
        if (languages.hasOwnProperty(lang)) // (lang in languages)
            highlightCode(pre, languages[lang]);
    });
}
    
$("#highlightButton").click(function(ev) {
    ev.preventDefault();
    highlightAllCode();
});

//
// 252
//    
tprint("### Layout");

///////////////////////////


}); /* $(document).ready */
