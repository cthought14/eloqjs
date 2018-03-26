// Chapter 19 (Project: A Paint Program).
"use strict";

$(document).ready(function() {

//
// 372
//
tprint("### 372 Implementation");

//
// 372
//
tprint("### 372 Building the DOM");

function elt3(name, attributes) {
    var node = document.createElement(name);
    if (attributes) {
        for (var attr in attributes)
            if (attributes.hasOwnProperty(attr))
                node.setAttribute(attr, attributes[attr]);
    }
    for (var i = 2; i < arguments.length; i++) {
        var child = arguments[i];
        if (typeof child == "string")
            child = document.createTextNode(child);
        node.appendChild(child);
    }
    return node;
}

//
// 373
//
tprint("### 373 The foundation");

var controls = Object.create(null);

function createPaint(parent) {
    var canvas = elt3("canvas", {width: 500, height: 300});
    var cx = canvas.getContext("2d");
    var toolbar = elt3("div", {class: "toolbar"});
    for (var name in controls)
        toolbar.appendChild(controls[name](cx));
    
    var panel = elt3("div", {class: "picturepanel"}, canvas);
    parent.appendChild(elt3("div", null, panel, toolbar));
}

//
// 374
//
tprint("### 374 Tool selection");

var tools = Object.create(null);

var MOUSE_LEFT_BUTTON = 1;

controls.tool = function(cx) {
    var select = elt3("select");
    for (var name in tools)
        select.appendChild(elt3("option", null, name));
        
    cx.canvas.addEventListener("mousedown", function(ev) {
        if (ev.which == MOUSE_LEFT_BUTTON) {
            tools[select.value](ev, cx);
            ev.preventDefault();
        }
    });
    
    return elt3("span", null, "Tool: ", select);
};

function relativePos(ev, element) {
    var rect = element.getBoundingClientRect();
    return {x: Math.floor(ev.clientX - rect.left),
            y: Math.floor(ev.clientY - rect.top)};
}

function trackDrag(onMove, onEnd) {
    function end(ev) {
        removeEventListener("mousedown", onMove);
        removeEventListener("mouseup", end);
        if (onEnd)
            onEnd(ev);
    }
    addEventListener("mousedown", onMove);
    addEventListener("mouseup", end);
}

tools.Line = function(ev, cx, onEnd) {
    cx.lineCap = "round";
    
    var pos = relativePos(ev, cx.canvas);
    trackDrag(function(ev) {
        cx.beginPath();
        cx.moveTo(pos.x, pos.y);
        pos = relativePos(ev, cx.canvas);
        cx.lineTo(pos.x, pos.y);
        cx.stroke();
    }, onEnd);
};

tools.Erase = function(ev, cx) {
    cx.globalCompositeOperation = "destination-out";
    tools.Line(ev, cx, function() {
        cx.globalCompositeOperation = "source-over";
    });
};

//
// 377
//
tprint("### 377 Color and brush size");

controls.color = function(cx) {
    var input = elt3("input", {type: "color"});
    input.addEventListener("change", function() {
        cx.fillStyle = input.value;
        cx.strokeStyle = input.value;
    });
    return elt3("span", null, "Color: ", input);
};

controls.brushSize = function(cx) {
    var select = elt3("select");
    var sizes = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];
    sizes.forEach(function(size) {
        select.appendChild(elt3("option", {value: size},
                            size + " pixels"));
    });
    select.addEventListener("change", function() {
        cx.lineWidth = select.value;
    });
    return elt("span", null, "Brush size: ", select);
};

//
// 379
//
tprint("### 379 Saving");

controls.save = function(cx) {
    var link = elt3("a", {href: "/"}, "Save");
    function update() {
        try {
            link.href = cx.canvas.toDataURL();
        }
        catch(e) {
            if (e instanceof SecurityError)
                link.href = "javascript:alert(" +
                    JSON.stringify("Can't save: " + e.toString()) + ")";
            else
                throw e;
        }
    }
    link.addEventListener("mouseover", update);
    link.addEventListener("focus", update);
    return link;
};

//
// 380
//
tprint("### 380 Loading image files");

















































    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    













        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        


}); /* $(document).ready */

