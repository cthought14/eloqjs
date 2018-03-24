// Miscellaneous utilities.
"use strict";

function forEach(collection, fn) {
    if ("length" in collection) {
        for (var i = 0; i < collection.length; i++) {
            fn(collection[i], i);
        }
    }
    else if (typeof collection === "object") {
        for (var key in collection) {
            fn(key, collection[key]);
        }
    }
    else {
        throw new SyntaxError("Expected: collection");
    }
}

function clamp(value, min_, max_) {
    return value < min_ ? min_ : value > max_ ? max_ : value;
}

// decodeEntities.
// https://stackoverflow.com/questions/5796718/html-entity-decode
var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

// elt1(type, child1, child2, ...)

function elt1(type) {
    var node = document.createElement(type);
    for (var i = 1; i < arguments.length; i++) {
        var child = arguments[i];
        if (typeof child == "string")
            child = document.createTextNode(child);
        node.appendChild(child);
    }
    return node;
}


// elt2(type, className, ...)
function elt2(name, className) {
    var elt = document.createElement(name);
    if (className) elt.className = className;
    for (var i = 2; i < arguments.length; i++) {
        var child = arguments[i];
        if (typeof child == "string")
            child = document.createTextNode(child);
        elt.appendChild(child);
    }
    return elt;
}

// deepEqual(a : object, b : object) -- True if a and b have the same contents.
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

////
////

// in_(prop, obj) -- Similar to (prop in obj).
function in_(prop, obj) {
    return obj.hasOwnProperty(prop);
}

// clearNode(node : Node)
function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

////
////

function showBorder(canvas) {
    var w = canvas.width;
    var h = canvas.height;
    var context = canvas.getContext("2d");
    context.strokeRect(0, 0, w, h);
}

////
////


function len(object) {
    if(0)(function(){
        console.log("type:",(typeof object));
    })();
    if (typeof object === "object") {
        if ("length" in object) {
            return object.length;
        }
        else {
            var np = 0;
            for (var p in object) 
                np++;
            return np;
        }
    }
    else {
        return -1;
    }
}

