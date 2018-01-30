// Chapter 13. Highlight code example.
"use strict";

$(document).ready(function() {

function forEach(collection, fn) {
    for (var i = 0; i < collection.length; i++) {
        fn(collection[i]);
    }
}

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

}); /* $(document).ready */
