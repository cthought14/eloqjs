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
        fn(collection[i], i);
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

var para1 = document.body.getElementsByTagName("p");
forEach(para1, function(para) {
    if (para.id == "boxedIn") {
        console.log("clientHeight:", para.clientHeight);
        console.log("offsetHeight:", para.offsetHeight);
    }
});

////
////

function time(name, action) {
    var start = Date.now();
    action();
    console.log(name, "took", Date.now() - start, "ms");
}

$("#naiveButton").click(function(ev) {
    ev.preventDefault();
    var target = document.getElementById("one");
    target.targetContent = "";
    time("naive", function() {
        // This method is slow because it constantly reads the NODE.offsetWidth
        // property, forcing the browser to continuously re-compute the layout.
        // On my system this draws 175 X's.
        while (target.offsetWidth < 2000)
            target.appendChild(document.createTextNode("X"));
    });
});

$("#cleverButton").click(function(ev) {
    ev.preventDefault();
    var target = document.getElementById("two");
    target.textContent = "";
    time("clever", function() {
        // --Note: This method tries to pre-compute the number of 
        // X's that fit in a width of 2000 pixels. 
        // However, it does not appear to be totally accurate. I needed
        // to increase the number of initial X's to 20 in order for it to render
        // the same as the naive method.
        // On my system this draws 175 X's.
        target.appendChild(document.createTextNode("XXXXXXXXXXXXXXXXXXXX"));
        var total = Math.ceil(2000 / (target.offsetWidth / 20));
        for (var i = 20; i < total; i++)
            target.appendChild(document.createTextNode("X"));
    });
});
    
//
// 254
//
tprint("### Styling");

$("#displayButton").click(function(ev) {
    ev.preventDefault();
    var strong = document.getElementById("hiddenText");    
    if (strong.style.display != "inline") {
        strong.style.display = "inline";
        this.textContent = "Hide Displayed Element";
    }
    else {
        strong.style.display = "none";
        this.textContent = "Display Hidden Element";
    }
});
    
$("#changeButton").click(function(ev) {
    ev.preventDefault();
    var para2 = document.getElementById("para2");
    console.log("para2 color before:", para2.style.color);
    if (para2.style.color != "magenta")
        para2.style.color = "magenta";
    else
        para2.style.color = "purple";
    console.log("para2 color after:", para2.style.color);
});

//
// 256
//
tprint("### Cascading styles");

//
// 257
//
tprint("### Query selectors");

function count(selector) {
    return document.querySelectorAll(selector).length;
}

expect(count("h1"), 1);             // All <h1>.
expect(count(".animal"), 2);        // Animal.
expect(count("p .animal"), 2);      // Animal somewhere in <p>.
expect(count("p > .animal"), 1);    // Animal directly in <p>.

//
// 258
//
tprint("### Positioning and animating");

expect(document.querySelectorAll(".cat img").length, 1);

var stopAnimationRequested = true;

$("#animateButton").click(function(ev) {
    ev.preventDefault();
    stopAnimationRequested = false;
    var cat = document.querySelector(".cat img");
    var angle = 0, lastTime = null;
    function animate(time) {
        if (lastTime != null)
            angle += (time - lastTime) * 0.001;
        lastTime = time;
        cat.style.top = (Math.sin(angle) * 20) + "px";
        cat.style.left = (Math.cos(angle) * 200) + "px";
        if (!stopAnimationRequested)
            requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});

$("#stopButton").click(function(ev) {
    ev.preventDefault();
    stopAnimationRequested = true;
});

//
// 261
//
tprint("### End of chapter");

}); /* $(document).ready */
