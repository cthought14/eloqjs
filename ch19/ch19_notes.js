// Chapter 19 (Project: A Paint Program).
"use strict";

var mainDiv = null;

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
    if(0) {
        for (var name in tools)
            select.appendChild(elt3("option", null, name));
    }
    else {
    
        select.appendChild(elt3("option", null, "Pick"));
        select.appendChild(elt3("option", null, "Rectangle"));
        select.appendChild(elt3("option", null, "Line"));
        select.appendChild(elt3("option", null, "Erase"));
        select.appendChild(elt3("option", null, "Text"));
        select.appendChild(elt3("option", null, "Spray"));
        var oldStyle = cx.fillStyle;
        cx.fillRect(10, 10, 100, 40);
        cx.fillStyle = "rgb(20, 200, 40)";
        cx.fillRect(30, 30, 120, 60);
        cx.fillStyle = oldStyle;
    }
    
    cx.canvas.addEventListener("mousedown", function(ev) {
        //console.log("mousedown");
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
        removeEventListener("mousemove", onMove);
        removeEventListener("mouseup", end);
        //console.log("onEnd");
        if (onEnd) 
            onEnd(ev);
    }
    addEventListener("mousemove", onMove);
    addEventListener("mouseup", end);
}

tools.Line = function(ev, cx, onEnd) {
    cx.lineCap = "round";
    
    var pos = relativePos(ev, cx.canvas);
    trackDrag(function(ev) {
        //console.log("trackDrag begin");
        cx.beginPath();
        cx.moveTo(pos.x, pos.y);
    }, function(ev) {
        //console.log("trackDrag onEnd");
        
        pos = relativePos(ev, cx.canvas);
        cx.lineTo(pos.x, pos.y);
        cx.stroke();
    });
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

var _colorInput = null;

function changeColor(r, g, b) {
    function hex(dec) {
        var hexOut = dec.toString(16);
        if (hexOut.length == 1)
            return "0" + hexOut;
        else
            return hexOut;
    }
    var rHex = r.toString(16);
    if (rHex.length == 1)
        rHex = "0" + rHex;
    

    var colorCode = "#" + hex(r) + hex(g) + hex(b);
    console.log("Color code is " + colorCode);
    _colorInput.value = colorCode;
}
    
controls.color = function(cx) {
    /*var*/ /*input*/ _colorInput = elt3("input", {type: "color"});
    _colorInput.addEventListener("change", function() {
        cx.fillStyle = _colorInput.value;
        cx.strokeStyle = _colorInput.value;
    });
    return elt3("span", null, "Color: ", _colorInput);
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
    return elt3("span", null, "Brush size: ", select);
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
                    elt3("button", {type: "submit"}, "load"));
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
        //console.log("Spray trackDrag begin");
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

//
// Exercise 1 - Rectangles
//

tools.Rectangle = function(ev, cx) {
    
    var pos1 = relativePos(ev, cx.canvas);
    
    var boxPos1 = {x: ev.pageX, y: ev.pageY};
    var box = elt3("div");
    box.style.position = "absolute";
    box.style.border = "1px solid " + cx.fillStyle;
    box.style.left = boxPos1 + "px";
    box.style.top = boxPos1 + "px";
    box.style.width = "1px";
    box.style.height = "1px";
    mainDiv.appendChild(box);

    trackDrag(function(ev) {
        //console.log("Rectangle trackDrag begin", pos1.x, pos1.y);
        
        var boxPos2 = {x: ev.pageX, y: ev.pageY};
        //console.log("boxPos1: " + JSON.stringify(boxPos1) + " boxPos2: " + JSON.stringify(boxPos2));
        if (boxPos2.x >= boxPos1.x) {
            var boxW = boxPos2.x - boxPos1.x;
            box.style.left = boxPos1.x + "px";
        }
        else {
            var boxW = boxPos1.x - boxPos2.x;
            box.style.left = boxPos2.x + "px";
        }
        
        if (boxPos2.y >= boxPos1.y) {
            var boxH = boxPos2.y - boxPos1.y;
            box.style.top = boxPos1.y + "px";
        }
        else {
            var boxH = boxPos1.y - boxPos2.y;
            box.style.top = boxPos2.y + "px";
        }
        
        //cx.fillRect(pos1.x, pos1.y, w, h);
        box.style.width = boxW + "px";
        box.style.height = boxH + "px";        
        
    }, function(ev) {
        var pos2 = relativePos(ev, cx.canvas);
        //console.log("Rectangle trackDrag end", pos2.x, pos2.y);
        if (pos2.x < pos1.x) {
            var tmp = pos2;
            pos2 = pos1;
            pos1 = tmp;
        }
        var w = pos2.x - pos1.x;
        var h = pos2.y - pos1.y;
        cx.fillRect(pos1.x, pos1.y, w, h);
        //console.log(pos1.x, pos1.y, w, h);
        mainDiv.removeChild(box);
    });
};

//
// Exercise 2 - tools.ColorPicker
//

if(1)(function(){
    function pixelAt(cx, x, y) {
        var data = cx.getImageData(x, y, 1, 1);
        console.log(data.data);
    }

    var canvas1 = document.createElement("canvas");
    var cx1 = canvas1.getContext("2d");
    pixelAt(cx1, 10, 10);

    cx1.fillStyle = "red";
    cx1.fillRect(10, 10, 1, 1);
    pixelAt(cx1, 10, 10);
})();
        
tools.Pick = function(ev, cx) {
    function pixelAt(cx, x, y) {
        var data = cx.getImageData(x, y, 1, 1);
        return data.data;
    }
    
    var pos1 = relativePos(ev, cx.canvas);
    var pixel = pixelAt(cx, pos1.x, pos1.y);
    var style = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
    cx.strokeStyle = style;
    cx.fillStyle = style;
    console.log("Set style to " + style);
    changeColor(pixel[0], pixel[1], pixel[2]);
};



////
////

mainDiv = document.querySelector("#mainDiv");
createPaint(mainDiv);



















































































































































































































    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    













        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        


}); /* $(document).ready */

