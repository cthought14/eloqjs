// Examples. Chapter 7.
"use strict";

//
// 140 
//
console.log("### 140 Definition");

var plan = 
 ["############################",
  "#      #    #      o      ##",
  "#                          #",
  "#          #####           #",
  "##         #   #    ##     #",
  "###           ##     #     #",
  "#           ###      #     #",
  "#    ####                  #",
  "#    ##      o             #",
  "# o   #        o       ### #",
  "#     #                    #",
  "############################"];

// "#" : wall
// "o" : critter
// " " : empty space    

//
// 141
//
console.log("### 141 Representing space");

Vector  // from Vector.js

var grid_2d = [
    ["top left",     "top middle",     "top right"],
    ["bottom left",  "bottom middle",  "bottom right"],
];

expect(grid_2d[1][2], "bottom right");

var grid_flat = [
    "top left",     "top middle",     "top right",
    "bottom left",  "bottom middle",  "bottom right",
];

expect(grid_flat[2 + (1 * 3)], "bottom right");

// Grid
// -------------------------
// Grid(width, height)
// isInside(vector : Vector)
//      : bool
// get(vector) : char
// set(vector, value)

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

var grid = new Grid(5, 5);
expect(grid.get(new Vector(1,1)), undefined);
grid.set(new Vector(1,1), "X");
expect(grid.get(new Vector(1,1)), "X");

//
// 143
//
console.log("### 143 A critter's programming interface");

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

// A critter can only see the squares directly around it on
// the grid. I.e., it can only see in directions n, ne, e, se,
// s, sw, w, or nw.

// View
// -----------
// look(direction) : char
//      -- The character (e.g. "#") in the specified direction
//      if it is next to the critter, otherwise, " " if nothing
//      is there.
//  find(char) : direction
//      -- The direction in which the character is to be found
//      next to the critter, otherwise, null if such a character 
//      cannot be found next to the critter.
//  findAll(char) : direction[]
//      -- Array with all directions where the character is to
//      be found next to the critter. For example, if the critter
//      is to the west of a wall, findAll("#") is ["ne", "e", 
//      "se"]:
//
//                ###
//                  #
//                 o#
//                  #
        
// Critter interface
// -----------------
// act(view : View)
//      -- Defines what the character does.

// BouncingCritter 
//      -- Stupid critter that follows its nose until
//      it hits an obstacle and then bounces off in a random
//      open direction.

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

function BouncingCritter() {
    this.direction = randomElement(directionNames);
};

BouncingCritter.prototype.act = function(view) {
    if (view.look(this.direction) != " ")
        this.direction = view.find(" ") || "s";
    return {type: "move", direction: this.direction};
}

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

var c1 = new BouncingCritter();
c1.direction = "n";
console.log(c1.direction);
console.log(c1.act(view_ex1));
view_ex1._steps++;
console.log(c1.act(view_ex1));
view_ex1._steps++;
console.log(c1.act(view_ex1));

//
// 144
// 
console.log("### 144 The world object");

  
// ... 146

//
// 146 
//
