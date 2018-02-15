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
                fieldType = "lava";
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

// DOMDisplay
// --------------------------
// DOMDisplay(parent, level)
// wrap : Node
// level : Level
// drawBackground() : Node
// actorLayer : Node
// drawFrame()
// drawActors() : Node
// scrollPlayerIntoView()
// clear()

function DOMDisplay(parent, level) {
    /* 
    <div class="game STATUS">
        <table class="background"> ... </table>
        <div> <!-- Actors --> ... </div>
    </div>
    */
    this.wrap = parent.appendChild(elt("div", "game"));
    this.level = level;
    
    this.wrap.appendChild(this.drawBackground());
    this.actorLayer = null;
    this.drawFrame();
}

var scale = 20;

// drawBackground() : Node
DOMDisplay.prototype.drawBackground = function() {
    var table = elt("table", "background");
    table.style.width = this.level.width * scale + "px";
    this.level.grid.forEach(function(row) {
        var rowElt = table.appendChild(elt("tr"));
        rowElt.style.height = scale + "px";
        row.forEach(function(type) {
            rowElt.appendChild(elt("td", type));
        });
    });
    return table;
}

// drawActors() : Node
DOMDisplay.prototype.drawActors = function() {
    /* 
    <div> <!-- Actors -->
        <div class="actor TYPE"> ... </div>
        <div ...> ... </div>
        ...
    </div>
    */
    var wrap = elt("div");
    this.level.actors.forEach(function(actor) {
        var rect = wrap.appendChild(elt("div", 
                    "actor " + actor.type));
        rect.style.width = actor.size.x * scale + "px";
        rect.style.height = actor.size.y * scale + "px";
        rect.style.left = actor.pos.x * scale + "px";
        rect.style.top = actor.pos.y * scale + "px";
    });
    return wrap;
}

// drawFrame()
DOMDisplay.prototype.drawFrame = function() {
    if (this.actorLayer)
        this.wrap.removeChild(this.actorLayer);
    this.actorLayer = this.wrap.appendChild(this.drawActors());
    this.wrap.className = "game " + (this.level.status || "");
    this.scrollPlayerIntoView();
};

// scrollPlayerIntoView()
DOMDisplay.prototype.scrollPlayerIntoView = function() {
    var width = this.wrap.clientWidth;
    var height = this.wrap.clientHeight;
    var margin = width / 3;
    
    // The viewport.
    var left = this.wrap.scrollLeft;
    var right = left + width;
    var top = this.wrap.scrollTop;
    var bottom = top + height;
    
    var player = this.level.player;
    var center = player.pos.plus(player.size.times(0.5)).times(scale);
                    // = (player.pos + (player.size * 0.5)) * scale
                    // To find the actor's center, we add its position and half its size.
                    // Then multiply to convert to pixel coordinates.
                    
    if (center.x < left + margin)
        this.wrap.scrollLeft = center.x - margin;
    else if (center.x > right - margin)
        this.wrap.scrollLeft = center.x + margin - width;
    if (center.y < top + margin)
        this.wrap.scrollTop = center.y - margin;
    else if (center.y > bottom - margin)
        this.wrap.scrollTop = center.y + margin - height;
};

// clear()
DOMDisplay.prototype.clear = function() {
    this.wrap.parentNode.removeChild(this.wrap);
};

$("#displaySimpleLevel").click(function(ev) {
    var simpleLevel = new Level(simpleLevelPlan);
    // --Q: Why doe sthe fixed lava (!) not display?
    // --A: I had misspelled the string "lava" in this line:
    //              fieldType = "lava";
    var display = new DOMDisplay(document.body, simpleLevel);
});

tprint("### 297 Motion and collision");

// Level::obstacleAt(pos : Vector, size : Vector) : str
Level.prototype.obstacleAt = function(pos, size) {
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var yEnd = Math.ceil(pos.y + size.y);
    
    if (xStart < 0 || xEnd > this.width || yStart < 0)
        // Everything to the left, right and above the level
        // is a wall.
        return "wall";
    if (yEnd > this.height)
        // Everything below the level is lava.
        return "lava";
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var fieldType = this.grid[y][x];
            if (fieldType) return fieldType;
        }
    }
};

// Level::actorAt(actor : Actor) : Actor
// -- Find the Actor that overlaps actor.
Level.prototype.actorAt = function(actor) {
    for (var i = 0; i < this.actors.length; i++) {
        var other = this.actors[i];
        if (other != actor &&
            actor.pos.x + actor.size.x > other.pos.x &&
            actor.pos.x < other.pos.x + other.size.x &&
            actor.pos.y + actor.size.y > other.pos.y &&
            actor.pos.y < other.pos.y + other.size.y)
        {
            return other;
        }
    }
};


/*
function hasTextCellInterface(obj) {
    return typeof obj.constructor == "function" 
        && typeof obj.minHeight == "function" 
        && typeof obj.minWidth == "function" 
        && typeof obj.draw == "function";
};
*/

function _isActor(obj) {
    if (obj === null) 
        return false;
    if (typeof obj == "undefined")
        return false;
    //return typeof obj.constructor == "function" 
    //    && typeof obj.pos != "undefined";
    return typeof obj.pos != "undefined";
}

Level.prototype._actor = function(pos) {
    var sz = 0.1;
    for (var ai = 0; ai < this.actors.length; ai++) {
        var a = this.actors[ai];
        //console.log(a);
        //console.log(pos);
        if (
            pos.x + sz > a.pos.x &&
            pos.x < a.pos.x + a.size.x &&
            pos.y + sz > a.pos.y &&
            pos.y < a.pos.y + a.size.y)
        {
            return a;
        }
    }
}

Level.prototype._someActor = function() {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var a = this._actor(new Vector(x,y));
            if (_isActor(a))
                return a;
        }
    }
}
        
var a1 = simpleLevel._actor(new Vector(4,4));
console.log(a1); // The player.
var a2 = simpleLevel._someActor();
console.log(a2); // Lava @ Vector(17,2) @ grid[2][17].
var a3 = simpleLevel._actor(new Vector(17,2));
console.log(a3); // Lava @ Vector(17,2) @ grid[2][17].



tprint("### 300 Actors and actions");




















    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}); /* $(document).ready */

