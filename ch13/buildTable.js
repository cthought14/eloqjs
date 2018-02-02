// buildTable. Chapter 13, Exercise 1. Build a table.
"use strict";

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

function buildTable(objects) {

    var table = elt("table");
    objects.forEach(function(obj, i) {
        if (i == 0) { // => Draw header.
            var headerRow = elt("tr");
            Object.keys(obj).forEach(function(key) {
                headerRow.appendChild(elt("th", key.toString()));
            });
            table.appendChild(headerRow);
        }
        
        var dataRow = elt("tr");
        Object.keys(obj).forEach(function(key) {
            var val = obj[key];
            var elt1 = elt("td", val.toString());
            if (typeof val == "number")
                elt1.style.textAlign = "right";
            dataRow.appendChild(elt1);
        });
        table.appendChild(dataRow);
    });
    return table;
}                 

$(document).ready(function() {

var mountainsTable = buildTable(MOUNTAINS);
document.getElementById("mountainsTable").appendChild(mountainsTable);
                 
}); /* $(document).ready */
