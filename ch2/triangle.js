// triangle. Chapter 2, Exercise 1. Looping a triangle.
"use strict";

for (var width = 1; width <= 7; width++) {
    var triangleRow = "";
    for (var i = 0; i < width; i++) {
        triangleRow += "#";
    }
    console.log(triangleRow);
}
