// electronicLife. Chapter 10, Exercise 2. A return to electronic life.
"use strict";

// area2d
// --------------------
// Vector
// Grid
// directions
// directionNames
// dirPlus

var area2d = function() {
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

    // Grid
    // -------------------------
    // Grid(width, height)
    // isInside(vector : Vector)
    //      : bool
    // get(vector) : char
    // set(vector, value)
    // width : int
    // height : int
    // forEach(f, context)

    function Grid(width, height) {
        this.space = new Array(width * height);
        this.width = width;
        this.height = height;
    }

    Grid.prototype.isInside = function(vector) {
        return  vector.x >= 0 && vector.x < this.width &&
                vector.y >= 0 && vector.y < this.height;
    };

    Grid.prototype.get = function(vector) {
        return this.space[vector.x + this.width * vector.y];
    };

    Grid.prototype.set = function(vector, value) {
        this.space[vector.x + this.width * vector.y] = value;
    };

    // 148
    Grid.prototype.forEach = function(f, context) {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var value = this.space[x + y * this.width];
                if (value != null)
                    f.call(context, value, new Vector(x, y));
            }
        }
    };
    
    //
    // directions
    //
    // 
    //  nw    n    ne
    //   w   0,0    e
    //  sw    s    se
    //  
    var directions = {
        "n":    new Vector(0,-1),
        "ne":   new Vector(1,-1),
        "e":    new Vector(1,0),
        "se":   new Vector(1,1),
        "s":    new Vector(0,1),
        "sw":   new Vector(-1,1),
        "w":    new Vector(-1,0),
        "nw":   new Vector(-1,-1),
    };

    var directionNames = "n ne e se s sw w nw".split(" ");
    
    // 152
    // dirPlus(dir, n) 
    //      -- Take direction dir and move clockwise n steps
    //      (e.g. "n" to "ne"). Return new direction. If n
    //      is negative, move -n steps counterclockwise.

    function dirPlus(dir, n) {
        var index = directionNames.indexOf(dir);
        return directionNames[(index + n + 8) % 8];
    }
    
    return {
        Vector: Vector,
        Grid: Grid,
        directions: directions,
        directionNames: directionNames,
        dirPlus: dirPlus,
    };
}();

// 1. Vector      
var v1 = new area2d.Vector(1,1);
expect(v1.x, 1);
expect(v1.y, 1);
expect(v1.length, Math.sqrt(2));
var v2 = new area2d.Vector(2,2);
expect(v2.length, Math.sqrt(8));
var v3 = v1.plus(v2);
expect(v3.x, 3);
expect(v3.y, 3);
var v4 = v1.minus(v2);
expect(v4.x, -1);
expect(v4.y, -1);
expect(v4.length, v1.length);

// 10. Grid
var grid_ex1 = new area2d.Grid(5, 5);
expect(grid_ex1.get(new area2d.Vector(1,1)), undefined);
grid_ex1.set(new area2d.Vector(1,1), "X");
expect(grid_ex1.get(new area2d.Vector(1,1)), "X");

// 12. directions
expect(area2d.directions["n"].y, -1);
expect(area2d.directionNames[0], "n");

// 14. dirPlus
expect(area2d.dirPlus("n", 1), "ne");

// util
// ----------------------
// randomElement

var util = function() {

    function randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    return {
        randomElement: randomElement,
    };
}();

// . randomElement
console.log("randomElement: ", util.randomElement([1,2,3]));


// life
// ----------------------
// BouncingCritter
// World
// elementFromChar
// charFromElement
// Wall
// View
// WallFollower
// LifelikeWorld
// Plant
// PlantEater
// SmartPlantEater
// Predator

var life = function() {

    // Critter interface
    // -----------------
    // act(view : View) : Action
    //      -- Defines what the character does.
    // energy : double
    //      -- In a LifelikeWorld, a critter dies when energy reaches 0.0.
    // originChar : char
    //      -- The character that represents this critter, e.g. "o".

    // BouncingCritter 
    //      -- Stupid critter that follows its nose until
    //      it hits an obstacle and then bounces off in a random
    //      open direction.

    function BouncingCritter() {
        this.direction = util.randomElement(area2d.directionNames);
    };

    // Action 
    // ------------------
    // type : string
    // direction : string

    BouncingCritter.prototype.act = function(view) {
        if (view.look(this.direction) != " ")
            this.direction = view.find(" ") || "s";
        return {type: "move", direction: this.direction};
    }

    return {
        BouncingCritter: BouncingCritter,
        World: {},
        elementFromChar: {},
        charFromElement: {},
        Wall: {},
        View: {},
        WallFollower: {},
        LifelikeWorld: {},
        Plant: {},
        PlantEater: {},
        SmartPlantEater: {},
        Predator: {},
    };
}();

(function(){
//
})();

// 15. BouncingCritter
console.log("BouncingCritter:");
(function(){
    // An example view that simulates the following situation and has the
    // critter move north, west, then south:

    //                ###
    //               #  #
    //                 o#
    //                  #

    var view_ex1 = {
        _steps: 0,
        look: function(direction) { 
            if (this._steps == 0) {
                if (direction == "e" || direction == "ne" || direction == "se")
                    return "#";
                return " ";
            }
            if (this._steps == 1) {
                if (direction == "nw" || direction == "n" || direction == "ne"
                        || direction == "e" || direction == "se")
                    return "#";
                return " ";
            }
            if (this._steps == 2) {
                if (direction == "w" || direction == "n" || direction == "ne")
                    return "#";
                return " ";
            }
        },
        find: function(character) {
            if (this._steps == 0) {
                if (character == " ") return "n";
                return null;
            }
            if (this._steps == 1) {
                if (character == " ") return "w";
                return null;
            }
            if (this._steps == 2) {
                if (character == " ") return "s";
                return null;
            }
            return null;
        },
    };

    var c1 = new life.BouncingCritter();
    c1.direction = "n";
    expect(c1.direction, "n");
    expect(c1.act(view_ex1).direction, "n");
    view_ex1._steps++;
    expect(c1.act(view_ex1).direction, "w");
    view_ex1._steps++;
    expect(c1.act(view_ex1).direction, "s");
})();


console.log("TODO");
