// chessBoard. Chapter 2, Exercise 3. Chess board.
"use strict";

// Marker to more easily see the beginning and end of each line.
var MARKER = "|";
var board = "";
// Modify size as desired.
var size = 13;

for (var row = 0; row < size; row++) {
    var line = "";
    line += MARKER;
    for (var col = 0; col < size; col++) {
        if (row % 2 != col % 2) // => row and col are both even or both odd.
            line += "#";
        else
            line += " ";
    }    
    line += MARKER;
    board += line + "\n";
}
console.log(board);
