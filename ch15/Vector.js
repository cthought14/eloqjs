// Vector. Chapter 6, Exercise 1. A vector type.
"use strict";

// ----------------------
// Vector
// ----------------------
// x : int
// y : int
// plus(other : Vector)
//      : Vector
// minus(other : Vector)
//      : Vector
// length : double

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function(otherVector) {
    return new Vector(this.x + otherVector.x, 
                      this.y + otherVector.y);
};

Vector.prototype.minus = function(otherVector) {
    return new Vector(this.x - otherVector.x, 
                      this.y - otherVector.y);  
}

Object.defineProperty(Vector.prototype, "length", {
    get: function() { 
        var x_2 = this.x * this.x;
        var y_2 = this.y * this.y;
        return Math.sqrt(x_2 + y_2);
    },
});

var v1 = new Vector(1,1);
expect(v1.x, 1);
expect(v1.y, 1);
expect(v1.length, Math.sqrt(2));
var v2 = new Vector(2,2);
expect(v2.length, Math.sqrt(8));
var v3 = v1.plus(v2);
expect(v3.x, 3);
expect(v3.y, 3);
var v4 = v1.minus(v2);
expect(v4.x, -1);
expect(v4.y, -1);
expect(v4.length, v1.length);

//
//
