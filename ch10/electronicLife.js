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

    //
    //
    
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

    // World
    // -----------
    // World(map, legend)
    // grid : Grid
    // legend : Legend
    // toString()
    // turn()
    // letAct(critter, vector)

    function World(map, legend) {
        var grid = new area2d.Grid(map[0].length, map.length);
        this.grid = grid; // Each grid position is an `element`.
        this.legend = legend;
        var self = this; // Workaround for the problem mentioned in 
                         // 'this and its scope'.
        
        map.forEach(function(line, y) {
            for (var x = 0; x < line.length; x++)  {
                self.grid.set(new area2d.Vector(x, y),
                        elementFromChar(legend, line[x]));
            }
        });
    }

    // elementFromChar()
    // Construct a new object (Critter) based on the legend and character.
    function elementFromChar(legend, ch) {
        if (ch == " ")
            return null;
        var element = new legend[ch]();
        // .originChar property is stored in the
        // relevant Object (e.g. Wall, BouncingCritter, etc.).
        element.originChar = ch;
        return element;
    }

    World.prototype.toString = function() {
        var output = "";
        for (var y = 0; y < this.grid.height; y++) {
            for (var x = 0; x < this.grid.width; x++) {
                var element = this.grid.get(new area2d.Vector(x, y));
                output += charFromElement(element);
            }
            output += "\n";
        }
        return output;
    };

    // charFromElement()
    function charFromElement(element) {
        if (element == null)
            return " ";
        else
            return element.originChar;
    }

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
        if (area2d.directions.hasOwnProperty(action.direction)) {
            // => Then action.direction is a valid direction.
            var dest = vector.plus(area2d.directions[action.direction]);
            if (this.grid.isInside(dest))
                // => Then dest is inside grid.
                return dest;
            // Implicitly return undefined.
        }
    };
    
    // Wall
    // -------
    
    function Wall() {}
    
    //
    // Animate the world on the web console.
    //
    showOnConsole // From webConsole.js

    function showText(id, text) {
        var counter = document.getElementById("counter");
        if (!counter) return;
        counter.textContent = text;
    }

    function animateWorld(world) {
        var worldView = {
            step: 0,
            nSteps: 1000,
            nextStep: function() { 
                if (this.step++ >= this.nSteps)
                    return;
                world.turn();
                showOnConsole(world.toString());
                showText("counter", "Time: " + this.step);
            },
        };

        setInterval(function() { 
            worldView.nextStep();
        }, 100);
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
        var target = this.vector.plus(area2d.directions[dir]);
        if (this.world.grid.isInside(target))
            // => Then target is inside the world's grid.
            return charFromElement(this.world.grid.get(target));
        else
            // Treat everything outside of the grid as a wall.
            return "#";
    };

    View.prototype.findAll = function(ch) {
        var found = [];
        for (var dir in area2d.directions)
            if (this.look(dir) == ch)
                found.push(dir);
        return found;
    };

    View.prototype.find = function(ch) {
        var found = this.findAll(ch);
        if (found.length == 0)
            return null;
        return util.randomElement(found);
    };

    // WallFollower
    // -----------------
    
    // A WallFollower is a critter that moves along walls, keeping its left
    // side to the wall.

    function WallFollower() {
        this.dir = "s";
    }

    WallFollower.prototype.act = function(view) {
        var start = this.dir;
        if (view.look(area2d.dirPlus(this.dir, -3)) != " ")
            start = this.dir = area2d.dirPlus(this.dir, -2);
        while (view.look(this.dir) != " ") {
            this.dir = area2d.dirPlus(this.dir, 1);
            if (this.dir == start) break;
        }
        return {type: "move", direction: this.dir};
    };
                  
    
    
    //
    //
    return {
        BouncingCritter: BouncingCritter,
        World: World,
        _elementFromChar: elementFromChar,
        _charFromElement: charFromElement,
        Wall: Wall,
        animateWorld: animateWorld,
        //View: View,
        WallFollower: WallFollower,
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

// . BouncingCritter
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
    // 15.
    expect(c1.direction, "n");
    expect(c1.act(view_ex1).direction, "n");
    view_ex1._steps++;
    expect(c1.act(view_ex1).direction, "w");
    view_ex1._steps++;
    expect(c1.act(view_ex1).direction, "s");
})();

// . World
var ex1 = function() {
    
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
        "#": life.Wall,
        "o": life.BouncingCritter,
    };

    var world = new life.World(plan, legend);
    console.log(world.toString());

    return {
        world: world,
    }
}();

(function() {
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
        "#": life.Wall,
        "o": life.BouncingCritter,
        "x": life.WallFollower,
    };

    function _charAt(world, x, y) {
        return life._charFromElement(world.grid.get(new area2d.Vector(x, y)));
    }

    var world_ex1 = new life.World(plan_ex1, legend_ex1);
    // 19.
    expect(_charAt(world_ex1, 6, 2), "x"); world_ex1.turn();
    expect(_charAt(world_ex1, 6, 3), "x"); world_ex1.turn();
    expect(_charAt(world_ex1, 5, 3), "x");
    console.log(world_ex1.toString());

})();

console.log("TODO");
