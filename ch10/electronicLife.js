// electronicLife. Chapter 10, Exercise 2. A return to electronic life.
"use strict";

var g_interval = {};

// area2d
// --------------------
// Vector
// Grid
// directions
// directionNames
// dirPlus

var area2d = function() {

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
    
    // directions
    // ---------------
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

// Vector      
var v1 = new area2d.Vector(1,1);
// 1.
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

// Grid
var grid_ex1 = new area2d.Grid(5, 5);
// 10.
expect(grid_ex1.get(new area2d.Vector(1,1)), undefined);
grid_ex1.set(new area2d.Vector(1,1), "X");
expect(grid_ex1.get(new area2d.Vector(1,1)), "X");

// directions
// 12.
expect(area2d.directions["n"].y, -1);
expect(area2d.directionNames[0], "n");

// dirPlus
// 14.
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

// randomElement
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
    
    // animateWorld()
    // Animate the world on the web console.
    function animateWorld(world) {
        stop();
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

        g_interval = setInterval(function() { 
            worldView.nextStep();
        }, 100);
    }
    
    showOnConsole // From webConsole.js

    function showText(id, text) {
        var counter = document.getElementById("counter");
        if (!counter) return;
        counter.textContent = text;
    }

    function stop() {
        clearInterval(g_interval);
    }
    
    function clear() {
        showOnConsole("");
    }
    
    // finalWorld()
    function finalWorld(world, finalSteps) {
        if (!finalSteps) finalSteps = 1000;
        var worldView = {
            step: 0,
            nSteps: finalSteps,
            nextStep: function() { 
                if (this.step++ >= this.nSteps)
                    return;
                world.turn();
                if (this.step < finalSteps)
                    this.nextStep();
                showOnConsole(world.toString());
                showText("counter", "Time: " + this.step);
            },
        };
        worldView.nextStep();
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

    actionTypes.move = function(critter, vector, action) {
        // `this` is a World.
        var dest = this.checkDestination(action, vector);
        if (dest == null || 
                    critter.energy <= 1 ||
                    this.grid.get(dest) != null)
            return false;
        critter.energy -= 1;
        this.grid.set(vector, null);
        this.grid.set(dest, critter);
    };

    actionTypes.eat = function(critter, vector, action) {
        var dest = this.checkDestination(action, vector);
        var atDest = dest != null && this.grid.get(dest);
        // atDest => Something can be eaten at the destination vector.
        if (!atDest || atDest.energy == null)
            return false;
        critter.energy += atDest.energy;
        this.grid.set(dest, null);
        return true;
    };

    actionTypes.reproduce = function(critter, vector, action) {
        var baby = elementFromChar(this.legend, critter.originChar);
        var dest = this.checkDestination(action, vector);
        if (dest == null ||
                    critter.energy <= 2 * baby.energy ||
                    this.grid.get(dest) != null)
            return false;
        critter.energy -= 2 * baby.energy;
        this.grid.set(dest, baby);
        return true;
    };
            
    actionTypes.sit = function(critter, vector, action) {
        critter.energy -= 0.01;
        return true;
    };

    // Plant
    // ---------
    
    // Plant "*"
    function Plant() { 
        // this.energy is in range [3.0, 7.0)
        this.energy = 3 + Math.random() * 4;
    }

    Plant.prototype.act = function(view) {
        if (this.energy > 15) {
            var space = view.find(" ");
            if (space)
                return {type: "reproduce", direction: space};
        }
        if (this.energy < 20)
            return {type: "grow"};
        // Otherwise, do nothing.
        return {type: "sit"};
    };

    // PlantEater
    // --------------
    
    // PlantEater "O"
    function PlantEater() {
        this.energy = 20;
        //this.energy = 40;
    }

    PlantEater.prototype.act = function(view) {
        var space = view.find(" ");
        if (this.energy > 60 && space)
            return {type: "reproduce", direction: space};
        var plant = view.find("*");
        if (plant)
            return {type: "eat", direction: plant};
        if (space)
            return {type: "move", direction: space};
        // Otherwise, do nothing.
        return {type: "sit"};
    };

    // SmartPlantEater
    // -----------------
    
    // SmartPlantEater "S"
    function SmartPlantEater() {
        this.energy = 20;
        this.direction = util.randomElement(area2d.directionNames);
    }

    SmartPlantEater.prototype.act = function(view) {
        var space = view.find(" ");
        if (this.energy > 30 && space)
            return {type: "reproduce", direction: space};
        var plant = view.find("*");
        if (this.energy < 20 && plant)
            return {type: "eat", direction: plant};
        
        if (!space && plant)
            return {type: "eat", direction: plant};    
        else if (!space)
            return {type: "sit"};
            
        if (view.look(this.direction) != " ")
            this.direction = view.find(" ") || "s";
        return {type: "move", direction: this.direction};
    };
    
    // Predator
    // ------------
    
    // Predator "!"
    function Predator() { 
        this.energy = 70;
    }

    Predator.prototype.act = function(view) {
        var space = view.find(" ");
        if (this.energy > 100 && space)
            return {type: "reproduce", direction: space};
        var prey = view.find("S");
        if (prey)
            return {type: "eat", direction: prey};
        if (space)
            return {type: "move", direction: space};
        // Otherwise, eat in a random direction.
        return {type: "eat", direction: util.randomElement(area2d.directionNames)};
    };
    
    ////////////////////////////////////////////////////
    return {
        BouncingCritter: BouncingCritter,
        World: World,
        _elementFromChar: elementFromChar,
        _charFromElement: charFromElement,
        Wall: Wall,
        animateWorld: animateWorld,
        stop: stop,
        clear: clear,
        finalWorld: finalWorld,
        //View: View,
        WallFollower: WallFollower,
        LifelikeWorld: LifelikeWorld,
        Plant: Plant,
        PlantEater: PlantEater,
        SmartPlantEater: SmartPlantEater,
        Predator: Predator,
    };
}();

(function(){
    //...
    return {
        /* ... */
    };
})();

// BouncingCritter
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

// World
var valley_exm1 = function() {
    
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
        "#": life.Wall,
        "o": life.BouncingCritter,
        "x": life.WallFollower,
    };

    var world_ex2 = new life.World(plan_ex2, legend_ex2);
    // 22.
    expect(_charAt(world_ex2, 1, 2), "x"); world_ex2.turn();
    expect(_charAt(world_ex2, 1, 3), "x"); world_ex2.turn();
    expect(_charAt(world_ex2, 2, 4), "x"); world_ex2.turn();
    expect(_charAt(world_ex2, 3, 4), "x");
    console.log(world_ex2.toString());

    
    
})();

// LifelikeWorld
var valley_exm2 = function() {
    
    var valley = new life.LifelikeWorld([
       "############################",
       "#####                 ######",
       "##   ***                **##",
       "#   *##**         **  O  *##",
       "#    ***          ##**    *#",
       "#       O    O    ##***    #",
       "#                 ##**     #",
       "#   O       #*             #",
       "#*          #**       O    #",
       "#***        ##**    O    **#",
       "##****     ###***       *###",
       "############################",
    ], {"#": life.Wall,
        "O": life.PlantEater,
        "*": life.Plant}
    );

    console.log(valley.toString());

    return {
        world: valley,
    }
}();

// SmartPlantEater
var valley_exr1 = function() {
    
    var world = new life.LifelikeWorld([
       "############################",
       "#####                 ######",
       "##   ***                **##",
       "#   *##**         **  S  *##",
       "#    ***          ##**    *#",
       "#       S    S    ##***    #",
       "#                 ##**     #",
       "#   S       #*             #",
       "#*          #**       S    #",
       "#***        ##**    S    **#",
       "##****     ###***       *###",
       "############################",
    ], {"#": life.Wall,
        "S": life.SmartPlantEater,
        "*": life.Plant}
    );

    console.log(world.toString());

    return {
        world: world,
    }
}();

// Predator
var valley_exr2 = function() {
    
    var world = new life.LifelikeWorld([
       "##############################################################################",
       "#####                                    *#    ! !            !         ######",
       "##   **                S **    #*      ####            **        ! !      **##",
       "#   *##* !  !      *  S S*   *##*           *  S  *   *##*           *  S  *##",
       "#    **   !       ##**     ** #*        ##**     **           ##**      SS  *#",
       "#       S         ##***   S    #*   ##***   SSS       ##***   SS        ##*  #",
       "#       S         ##**       ###*     ##**              ####**  S            #",
       "#   SS      #*         #*         #*         #*         ##                   #",
       "#*         *#**       S      *#**       S      *#**              *#**   S  SS#",
       "#***        ##**    SS   **   ##**    S    **   ##**    SSS  **   ##**    S  #",
       "##****     ###***       *######**       *#####*         *#####***       *##  #",
       "#####                                       *            #              ######",
       "##   **                 **                  **        **        **        **##",
       "#   *##*           *  SS *#   *    S  *#     *  S  *#     *  S  *#     *  S  #",
       "#    **           ##** S  *  ##** S    *##**    *  ##**    *  ##**    * ###**#",
       "#      SS         ##**  S      ##*       *  ##**         ##***        ##***  #",
       "#                 ##**   S                  *#             ! ###  ##         #",
       "#    S      #*     ###*           !         ##                ##  ##     !   #",
       "#   S       #*       ##         !   !      ###          !  !  ##**##   ! !   #",
       "#   S       #*       ##*    #             #* #      #*   !     ####          #",
       "#   S       #*        #########                                     S        #",
       "#*     !!  *#**           *##**       S    *#**       S    *#**   S   S      #",
       "#***        ##**    SS   **##**    S     *##**    S    * ##**    S    *     *#",
       "##**       ###***    S  *###     *##      *##      *##      *##      *##     #",
       "##############################################################################",
    ], {"#": life.Wall,
        "S": life.SmartPlantEater,
        "!": life.Predator,
        "*": life.Plant}
    );

    console.log(world.toString());

    return {
        world: world,
    }
}();

