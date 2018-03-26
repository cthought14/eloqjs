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

function loadImageURL(cx, url) {
    var image = document.createElement("img");
    image.addEventListener("load", function() {
        var color = cx.fillStyle;
        var size = cx.lineWidth;
        cx.canvas.width = image.width;
        cx.canvas.height = image.height;
        cx.drawImage(image, 0, 0);
        cx.fillStyle = color;
        cx.strokeStyle = color;
        cx.lineWidth = size;
    });
    image.src = url;
}

controls.openFile = function(cx) {
    var input = elt3("input", {type: "file"});
    input.addEventListener("change", function() {
        if (input.files.length == 0)
            return;
        var reader = new FileReader();
        reader.addEventListener("load", function() {
            loadImageURL(cx, reader.result);
        });
        reader.readAsDataURL(input.files[0]);
    });
    return elt3("div", null, "Open file: ", input);
};

controls.openURL = function(cx) {
    var input = elt3("input", {type: "text"});
    var form = elt3("form", null,
                    "Open URL: ", input, 
                    elt("button", {type: "submit"}, "load"));
    form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        loadImageURL(cx, input.value);
    });
    return form;
};

//
// 382
//
tprint("### 382 Finishing up");

tools.Text = function(ev, cx) {
    var text = prompt("Text:", "");
    if (text) {
        var pos = relativePos(ev, cx.canvas);
        cx.font = clamp(cx.lineWidth, 7, 100) + "px sans-serif";
        cx.fillText(text, pos.x, pos.y);
    }
};

tools.Spray = function(ev, cx) {
    var radius  = cx.lineWidth / 2;
    var area = radius * radius * Math.PI;
    var dotsPerTick = Math.ceil(area / 30);
    
    var currentPos = relativePos(ev, cx.canvas);
    var spray = setInterval(function() {
        for (var i = 0; i < dotsPerTick; i++) {
            var offset = randomPointInRadius(radius);
            cx.fillRect(currentPos.x + offset.x,
                        currentPos.y + offset.y, 1, 1);
        }
    }, 25);
    trackDrag(function(ev) {
        currentPos = relativePos(ev, cx.canvas);
    }, function() {
        clearInterval(spray);
    });
};

function randomPointInRadius(radius) {
    for (;;) {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        if (x * x + y * y <= 1) // => Then (x,y) lies in the unit circle.
            return {x: x * radius, y: y * radius};
    }
}


























































































































































































































    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    













        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        


}); /* $(document).ready */

