// TextCell interface, definition and utilities. Eloquent JavaScript, Chapter 6.
"use strict";

// ----------------------
// TextCell interface
// ----------------------
// minHeight() : int
// minWidth() : int
// draw(width, height)

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

function rowHeights(rows) {
    return rows.map(function(row) {
        return row.reduce(function(max, cell) {
            return Math.max(max, cell.minHeight());
        }, 0);
    });
}

function colWidths(rows) {
    return rows[0].map(function(_, i) {
        return rows.reduce(function(max, row) {
            return Math.max(max, row[i].minWidth());
        }, 0);
    });
}

function repeat(string, times) {
    var result = "";
    for (var i = 0; i < times; i++) 
        result += string;
    return result;
}

//
//

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

function hasTextCellInterface(obj) {
    return typeof obj.constructor == "function" 
        && typeof obj.minHeight == "function" 
        && typeof obj.minWidth == "function" 
        && typeof obj.draw == "function";
};
