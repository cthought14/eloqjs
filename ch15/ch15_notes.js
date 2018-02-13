// Chapter 15 (Project: A Platform Game).
"use strict";
Vector; // From Vector.js.

$(document).ready(function() {

//
// 286
//
tprint("### Levels");
var simpleLevelPlan = [
    "                      ",
    "                      ",
    "  x              = x  ",
    "  x         o o    x  ",
    "  x @      xxxxx   x  ",
    "  xxxxx            x  ",
    "      x!!!!!!!!!!!!x  ",
    "      xxxxxxxxxxxxxx  ",
    "                      ",
];

// x: Wall
// !: Fixed lava
// @: Player
// o: Coin
// =: Horizontal lava
// |: Vertical lava
// v: Dripping lava

tprint("### Reading a level");

// Level::Level(plan)
function Level(plan) {
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = [];
    this.actors = [];
    
    for (var y = 0; y < this.height; y++) {
        var line = plan[y];
        var gridLine = [];
        for (var x = 0; x < this.width; x++) {
            var ch = line[x];
            var fieldType = null;
            var Actor = actorChars[ch];
            if (Actor)
                this.actors.push(new Actor(new Vector(x, y), ch));
            else if (ch == "x")
                fieldType = "wall";
            else if (ch == "!")
                fieldType = "laval";
            gridLine.push(fieldType);
        }
        this.grid.push(gridLine);
    }
    
    this.player = this.actors.filter(function(actor) {
        return actor.type == "player";
    })[0];
    this.status = null;
    this.finishDelay = null;
}

// Level::isFinished() : bool
Level.prototype.isFinished = function() {
    return this.status != null && this.finishDelay < 0;
}

tprint("### Actors");

// Actor
// --------------------------------
// Actor(pos : Vector, ch : char)

var actorChars = {
    "@": Player,
    "o": Coin,
    "=": Lava, // Horizontal lava
    "|": Lava, // Vertical lava
    "v": Lava  // Dripping lava
};

// Player : Actor
// ------------------------------
// Player(pos : Vector)
// pos : Vector
// size : Vector
// speed : Vector

function Player(pos) {    
    this.pos = pos.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);   // Player is 1.5 squares high.
    this.speed = new Vector(0, 0);
}

Player.prototype.type = "player";

// Lava : Actor
// ----------------------------
// Lava(pos : Vector, ch)
// pos
// size
// speed
// repeatPos : Vector

function Lava(pos, ch) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    if (ch == "=") {
        this.speed = new Vector(2, 0);
    } else if (ch == "|") {
        this.speed = new Vector(0, 2);
    } else if (ch == "v") {
        this.speed = new Vector(0, 3);
        this.repeatPos = pos;
    }
}

Lava.prototype.type = "lava";

// Coin : Actor
// ------------------------
// Coin(pos)
// basePos : Vector
// pos
// size
// wobble : double

function Coin(pos) {
    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
    this.size = new Vector(0.6, 0.6);
    this.wobble = Math.random() * Math.PI * 2;
}

Coin.prototype.type = "coin";

var simpleLevel = new Level(simpleLevelPlan);
expect(simpleLevel.width, 22);
expect(simpleLevel.height, 9);

tprint("### Encapsulation as a burden");
tprint("### Drawing");

// ...

tprint("### Motion and collision");

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}); /* $(document).ready */

