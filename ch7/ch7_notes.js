// Examples. Chapter 7.
"use strict";

//
// 140 
//
console.log("### 140 Definition");

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

var grid_ex1 = new Grid(5, 5);
expect(grid_ex1.get(new Vector(1,1)), undefined);
grid_ex1.set(new Vector(1,1), "X");
expect(grid_ex1.get(new Vector(1,1)), "X");

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


// A critter can only see the squares directly around it on
// the grid. I.e., it can only see in directions n, ne, e, se,
// s, sw, w, or nw.

// View
// -----------
// View(world, vector)
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

// 150
function View(world, vector) {
    this.world = world;
    this.vector = vector;
}

View.prototype.look = function(dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target))
        // => Then target is inside the world's grid.
        return charFromElement(this.world.grid.get(target));
    else
        // Treat everything outside of the grid as a wall.
        return "#";
};

View.prototype.findAll = function(ch) {
    var found = [];
    for (var dir in directions)
        if (this.look(dir) == ch)
            found.push(dir);
    return found;
};

View.prototype.find = function(ch) {
    var found = this.findAll(ch);
    if (found.length == 0)
        return null;
    return randomElement(found);
};
        
// Critter interface
// -----------------
// act(view : View) : Action
//      -- Defines what the character does.
// energy : double
//      -- In a LifelikeWorld, a critter dies when energy reaches 0.0.

// BouncingCritter 
//      -- Stupid critter that follows its nose until
//      it hits an obstacle and then bounces off in a random
//      open direction.

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function BouncingCritter() {
    this.direction = randomElement(directionNames);
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

// Construct an `element` object.
function elementFromChar(legend, ch) {
    if (ch == " ")
        return null;
    var element = new legend[ch]();
    // .originChar property is stored in the
    // relevant Object (e.g. Wall, BouncingCritter, etc.).
    element.originChar = ch;
    return element;
}

function charFromElement(element) {
    if (element == null)
        return " ";
    else
        return element.originChar;
}

//
//

// World
// -----------
// World(map, legend)
// grid : Grid
// legend : Legend
// toString()
// turn()
// letAct(critter, vector)

function World(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid; // Each grid position is an `element`.
    this.legend = legend;
    var self = this; // Workaround for the problem mentioned in 
                     // 'this and its scope'.
    
    map.forEach(function(line, y) {
        for (var x = 0; x < line.length; x++)  {
            self.grid.set(new Vector(x, y),
                    elementFromChar(legend, line[x]));
        }
    });
}

World.prototype.toString = function() {
    var output = "";
    for (var y = 0; y < this.grid.height; y++) {
        for (var x = 0; x < this.grid.width; x++) {
            var element = this.grid.get(new Vector(x, y));
            output += charFromElement(element);
        }
        output += "\n";
    }
    return output;
};

// 148
World.prototype.turn = function() {
    var acted = [];
    this.grid.forEach(function(critter, vector) {
        if (critter.act && acted.indexOf(critter) == -1) { 
            // => Then critter is a critter that did not already act.
            acted.push(critter);
            this.letAct(critter, vector);
        }
    }, this);
};

// 149
World.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    if (action && action.type == "move") {
        var dest = this.checkDestination(action, vector);
        if (dest && this.grid.get(dest) == null) {
            this.grid.set(vector, null);
            this.grid.set(dest, critter);
        }
    }
};

World.prototype.checkDestination = function(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
        // => Then action.direction is a valid direction.
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest))
            // => Then dest is inside grid.
            return dest;
        // Implicitly return undefined.
    }
};

//
//

function Wall() {}

//
//

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

var legend = {
    "#": Wall,
    "o": BouncingCritter,
};

var world = new World(plan, legend);
console.log(world.toString());

//
// 146
//
console.log("### 146 this and its scope");

var test_ex0 = {
    prop: 10,
    addPropTo: function(array) {
        return array.map(function(elt) {
            return this.prop + elt;
        });
    }
};

// Does not work:
//expect(test_ex0.addPropTo([10,20,30]), [20,30,40]);

var test_ex1 = {
    prop: 10,
    addPropTo: function(array) {
        // 'self' workaround:
        var self = this;
        return array.map(function(elt) {
            return self.prop + elt;
        });
    }
};

expect(test_ex1.addPropTo([10,20,30]), [20,30,40]);

var test_ex2 = {
    prop: 10,
    addPropTo: function(array) {
        // 'bind' workaround:
        return array.map(function(elt) {
            return this.prop + elt;
        }.bind(this));
    }
};

test_ex2.setProp = function(newProp) { 
    this.prop = newProp;
};
test_ex2.setProp(110);

expect(test_ex2.addPropTo([10,20,30]), [120,130,140]);

var test_ex3 = {
    prop: 10,
    addPropTo: function(array) {
        // Most standard higher-order methods on arrays take
        // an optional `context` parameter that behaves similarly
        // to bind(this):
        return array.map(function(elt) {
            return this.prop + elt;
        }, this);
    }
};

expect(test_ex3.addPropTo([10,20,30]), [20,30,40]);
            
// To add your own context parameter to your own higher-order 
// function, use the call() method. See Grid::forEach().
            
var grid_ex2 = new Grid(3, 3);
grid_ex2.set(new Vector(0,0), "A");
grid_ex2.set(new Vector(1,1), "B");
grid_ex2.set(new Vector(2,2), "C");
grid_ex2.forEach(function(value, vector) {
    var pos = "(" + vector.x + ", " + vector.y + ")";
    console.log(pos + " Grid element: " + value);
});

var grid_ex3 = new Grid(3, 3);
grid_ex3.name = "grid_ex3";
grid_ex3.show = function() {
    console.log("show()");
    // Why doesn't the following produce output?
    this.forEach(function(value, vector) {
        var pos = "(" + vector.x + ", " + vector.y + ")";
        console.log("{" + name + "} " + pos + " Grid element: " + value);
    }, this);
};

grid_ex3.show();

//
// 148
//
console.log("### 148 Animating life");

//
// 151
//
console.log("### 151 It moves");
for (var i = 0; i < 5; i++) {
    world.turn();
    console.log(world.toString());
}

//
// Animate the world on the web console.
//
showOnConsole // From webConsole.js
var world = new World(plan, legend);

function animateWorld(world) {
    var worldView = {
        step: 0,
        nSteps: 500,
        nextStep: function() { 
            if (this.step++ >= this.nSteps)
                return;
            world.turn();
            showOnConsole(world.toString());
        },
    };

    setInterval(function() { 
        worldView.nextStep();
    }, 100);
}

animateWorld(world);

//
// 152
//
console.log("### 152 More life forms");

// A WallFollower is a critter that moves along walls, keeping its left
// side to the wall.

function WallFollower() {
    this.dir = "s";
}

WallFollower.prototype.act = function(view) {
    var start = this.dir;
    if (view.look(dirPlus(this.dir, -3)) != " ")
        start = this.dir = dirPlus(this.dir, -2);
    while (view.look(this.dir) != " ") {
        this.dir = dirPlus(this.dir, 1);
        if (this.dir == start) break;
    }
    return {type: "move", direction: this.dir};
};
              
/*
Example 1. If x is the WallFollower and is heading south, it should 
move west when it hits the south wall.
*/

var plan_ex1 = 
 ["########",
  "#      #",
  "#     x#",
  "#      #",
  "########"];

var legend_ex1 = {
    "#": Wall,
    "o": BouncingCritter,
    "x": WallFollower,
};

function _charAt(world, x, y) {
    return charFromElement(world.grid.get(new Vector(x, y)));
}

var world_ex1 = new World(plan_ex1, legend_ex1);
expect(_charAt(world_ex1, 6, 2), "x"); world_ex1.turn();
expect(_charAt(world_ex1, 6, 3), "x"); world_ex1.turn();
expect(_charAt(world_ex1, 5, 3), "x");
console.log(world_ex1.toString());

/*
Example 2. If a WallFollower is following a wall and hits open space
it will move southeast to continue following.
*/

var plan_ex2 = 
 ["        ",
  "  ##### ",
  " x#   # ",
  "  ##### ",
  "        "];

var legend_ex2 = {
    "#": Wall,
    "o": BouncingCritter,
    "x": WallFollower,
};

var world_ex2 = new World(plan_ex2, legend_ex2);
expect(_charAt(world_ex2, 1, 2), "x"); world_ex2.turn();
expect(_charAt(world_ex2, 1, 3), "x"); world_ex2.turn();
expect(_charAt(world_ex2, 2, 4), "x"); world_ex2.turn();
expect(_charAt(world_ex2, 3, 4), "x");
console.log(world_ex2.toString());

//
// 153
// 
console.log("### 153 A more lifelike simulation");

// LifelikeWorld : World
// --------------------------
// LifelikeWorld(map, legend)
// letAct(critter, vector) 

function LifelikeWorld(map, legend) {
    World.call(this, map, legend);
}

LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    var actionFn = actionTypes[action.type];
    var handled = action && 
            action.type in actionTypes &&
            actionFn.call(this, critter, vector, action);
    // Usage: fn.call(context, arg1ToFn, arg2ToFn, ...);
    
    if (!handled) {
        critter.energy -= 0.2;
        if (critter.energy <= 0)
            this.grid.set(vector, null);
    }
};
        
//
// 154
//
console.log("### 154 Action handlers");

// actionTypes
// ----------------
// grow(critter)
//      -- Always succeeds. Critter gains a bit of energy.
// move(critter, vector, action)
//      -- Critter tries to move to the destination vector
//      using action. It takes some energy to move, and
//      movement can fail if the destination is occupied 
//      or if the critter has insufficient energy.
// eat(critter, vector, action)
//      -- Critter can eat if it is at the location specified
//      by vector. Eating transfers the energy of whatever
//      is at the destination to critter and removes the 
//      eaten from the grid.
// reproduce(critter, vector, action)
//      -- Critter reproduces asexually to the destination 
//      vector. Fails if critter does not have enough energy.
//      If reproduction is successful, critter's energy is reduced.


// Example action handler declaration:
//      function anActionHandler(critter, vector, action) { ... }

actionTypes.grow = function(critter) {
    critter.energy += 0.5;
    return true;
};
/*
actionTypes.move = function(critter, vector, action) {
*/    
        
//
// 156
//        
        
