// Examples. Chapter 6.
"use strict";

//
// 121 - Constructors
//
console.log("## 121 - Constructors");

function Rabbit(type) {
    this.type = type;
}

var killerRabbit = new Rabbit("killer");
var blackRabbit = new Rabbit("black");

Rabbit.prototype.speak = function(line) {
    console.log(this.getGreeting(line) + ".");
}
Rabbit.prototype.getGreeting = function(line) {
    return "The " + this.type + " rabbit says '" + line + "'";
}

killerRabbit.speak = function(line) { 
    console.log(this.getGreeting(line).toUpperCase() + "!");
}

killerRabbit.speak('how do you do, sir?');
blackRabbit.speak('very well, thank you.');

//
// 124 - Prototype interference
// 
console.log("## 124 - Prototype interference");

var map = {};
function storePhi(event, phi) {
    map[event] = phi;
}

storePhi("pizza", 0.069);
storePhi("touched tree", -0.081);

// Properties like .toString in Object.prototype are not
// enumerable, so they do not show up in var ... in.

Object.prototype.nonsense = "hi";
Object.defineProperty(Object.prototype, "hiddenNonsense", 
                      {enumerable: false, value: "hi"});
for (var name in map)
    console.log(name);

// `in` returns true for any property, even nonenumerable.
// But we can use hasOwnProperty() to find out if the property
// belongs to the object itself.

expect("hiddenNonsense" in map, true);
expect(map.hasOwnProperty("hiddenNonsense"), false);

// Here is a 'safer' way to iterate over properties. It 
// iterates over only properties in the object itself.

for (var name in map) {
    if (!map.hasOwnProperty(name)) continue;
    // Do something with name.
    console.log(name);
}

//
// 126 Prototype-less objects
//
console.log("## 126 Prototype-less objects");

// If an object is created with null as the prototype, 
// then we don't need the 'safer' loop. All the properties
// belong to the object itself.

function storePhi2(event, phi) {
    map2[event] = phi;
}

var map2 = Object.create(null);

storePhi2("pizza", 0.069);
storePhi2("touched tree", -0.081);

for (var name in map2) 
    console.log(name);

//
// 127 Laying out a table
//
console.log("## 127 Laying out a table");
    
/*
--------------
Cell interface
--------------

minHeight()
    // Cell's minimum height in lines.
minWidth()
    // Cell's minimum width in characters.
draw(width, height) 
    // Return array of `height` elems, each of width `width`.
    
*/

// var rows = [ ["r1c1", "r1c2", ...],
//              ["r2c1", "r2c2", ...],
//              ...,
//          ];

function rowHeights(rows) {
    return rows.map(function(row) {
        return row.reduce(function(max, cell) {
            return Math.max(max, cell.minHeight());
        }, 0);
    });
}

// arr.reduce(function(max, elem) { ... }, 0) is supposed 
// to find the maxmimum value in arr.

var arr1 = [9, 2, 8, 99, 23, 999, 3];
var arr1_max = 
        arr1.reduce(function(max, elem) {
            return Math.max(max, elem);
        }, 0);
expect(arr1_max, 999);

// However, it does not work in this case because 0
// is used as the starting value.

var arr2 = [-9, -2, -8, -99, -23, -999, -3];
var arr2_max = 
        arr2.reduce(function(max, elem) {
            return Math.max(max, elem);
        }, 0);
expect(arr2_max, -2);

// An alternative is to use the iterative approach used in 
// in Chapter 3, Exercise 1 (minimum). This method works 
// without assuming an arbitrary starting point like 0:

function max(arr) {
    //assert(arr.length >= 1);
    var high = arr[0];
    for (var i = 1; i < arr.length; i++)
        if (arr[i] > high)
            high = arr[i];
    return high;
}

arr2_max = max(arr2);
expect(arr2_max, -2);

// We can achieve the same thing using the functional 
// approach as well, by modifying the starting point:

arr2_max = 
        arr2.reduce(function(max, elem) {
            return Math.max(max, elem);
        }, arr2[0]);
expect(arr2_max, -2);

// map(), when given a two-argument function parameter
// (elem, i), calls the function with each element elem 
// of the array, and each i is the index of that element.

function colWidths(rows) {
    return rows[0].map(function(_, i) {
        return rows.reduce(function(max, row) {
            return Math.max(max, row[i].minWidth());
        }, 0);
    });
}


function drawTable(rows) {
    var heights = rowHeights(rows);
    var widths = colWidths(rows);
    
    // var blocks_ex1 = ["col1", "col2", "col3"];
    function drawLine(blocks, lineNum) {
        return blocks.map(function(block) {
            return block[lineNum];
        }).join(" ");
    }
    
    function drawRow(row, rowNum) {
        var blocks = row.map(function(cell, colNum) {
            return cell.draw(widths[colNum], heights[rowNum]);
        });
        return blocks[0].map(function(_, lineNum) {
            return drawLine(blocks, lineNum);
        }).join("\n");
    }
    return rows.map(drawRow).join("\n");
}

function repeat(string, times) {
    var result = "";
    for (var i = 0; i < times; i++) 
        result += string;
    return result;
}

//
//

function TextCell(text) {
    this.text = text.split("\n");
}

TextCell.prototype.minWidth = function() {
    // Find maximum width in text, starting from 0.
    return this.text.reduce(function(width, line) {
        return Math.max(width, line.length);
    }, 0);
};

TextCell.prototype.minHeight = function() {
    return this.text.length;
};

TextCell.prototype.draw = function(width, height) {
    var result = [];
    for (var i = 0; i < height; i++) {
        var line = this.text[i] || "";
        var padding = repeat(" ", width - line.length);
        result.push(line + padding);
    }
    return result;
};

//
//

var rows_ex1 = [];
for (var i = 0; i < 5; i++) {
    var row = [];
    for (var j = 0; j < 5; j++) {
        if ((j + i) % 2 == 0)
            row.push(new TextCell("##"));
        else
            row.push(new TextCell("  "));
    }
    rows_ex1.push(row);
}

console.log("rows_ex1:");
console.log(drawTable(rows_ex1));

// It is likely that we will have some tabular data formatted like this,
// as a plain "text matrix" of strings, where each string represents a cell. 
// I made one of the cells slightly longer to demonstrate drawTable().

var textMatrix_ex1 = [ 
    ["r1c1", "r1c2 ABCDEFG", "r1c3"],
    ["r2c1", "r2c2", "r2c3"],
    ["r3c1", "r3c2", "r3c3"],
];

// To convert a text matrix (array of array of strings) into the structure
// that drawTable() expects, I define a constructor called Rows() that 
// returns an array in the required structure, using the same procedure 
// above as for rows_ex1.

function Rows(textMatrix) {
    var rows1 = [];
    for (var i = 0; i < textMatrix.length; i++) {
        var row = [];
        for (var j = 0; j < textMatrix[0].length; j++) {
            row.push(new TextCell(textMatrix[i][j]));
        }
        rows1.push(row);
    }
    return rows1;
}

var rows_ex2 = new Rows(textMatrix_ex1);
console.log("rows_ex2: ");
console.log(drawTable(rows_ex2));

// (131)
