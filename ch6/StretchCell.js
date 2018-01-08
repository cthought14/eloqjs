// StretchCell. Chapter 6, Exercise 2. Another cell.
"use strict";

var table1 = [
    [new TextCell("aa"), new TextCell("aaaa"), new TextCell("aaaaaa")],
    [new TextCell("aaaaaaaa"), new TextCell("bb"), new TextCell("bbbb")],
    [new TextCell("bbbbbb"), new TextCell("bbbbbbbb"), new TextCell("cc")],
];
console.log(drawTable(table1)); console.log("");

//
//

// --------------------------------------------
// StretchCell
// --------------------------------------------
// StretchCell(inner : TextCell, 
//             width : int, height : int)
// minHeight() : int
// minWidth() : int
// draw(width, height)

function StretchCell(inner, width, height) {
    this.inner = inner;
    this.width = width;
    this.height = height;
}

StretchCell.prototype.minWidth = function() {
    var w = this.inner.minWidth();
    if (w < this.width)
        return this.width;
    else
        return w;
};

StretchCell.prototype.minHeight = function() {
    var h = this.inner.minHeight();
    if (h < this.height)
        return this.height;
    else
        return h;
};

StretchCell.prototype.draw = function(width, height) {
    return this.inner.draw(width, height)
};
    
var table2 = [
    [new StretchCell(new TextCell("AA"), 12, 2), new TextCell("aaaa"), new TextCell("aaaaaa")],
    [new TextCell("aaaaaaaa"), new TextCell("bb"), new TextCell("bbbb")],
    [new TextCell("bbbbbb"), new TextCell("bbbbbbbb"), new TextCell("cc")],
];
console.log(drawTable(table2)); console.log("");

expect(hasTextCellInterface(table2[0][0]), true);

//
//
