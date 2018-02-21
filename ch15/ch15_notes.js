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

// Level
// ------------------------
// Level(plan : str[])
// animate(steps, keys)
// isFinished() : bool
// obstacleAt(pos, size) : str // fieldType
// playerTouched(obstacleType, actor)
//
// width : int (E.g. 22)
// height : int (E.g. 9)
// actors : Actor[]
// player : Actor
// finishDelay : int
// grid: str[][] // E.g. [0][0] = "wall"
// status : str // E.g. "lost"


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
// act(step, level : Level, keys : KEYS)

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

// Display (interface)
// --------------------------
// Display(parent : Node, 
//          level : Level)

// DOMDisplay : Display
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
// showLives()

function DOMDisplay(parent, level) {
    /* 
    <div class="game STATUS">
        <table class="background"> ... </table>
        <div> <!-- Actors --> ... </div>
    </div>
    */
    this.wrap0 = parent.appendChild(elt("div", "game0"));
    this.wrap = this.wrap0.appendChild(elt("div", "game"));
    this.scoreboard = this.wrap0.appendChild(elt("p", "scoreboard", "Hello"));
    this.scoreboard.textContent = "??";
    
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

// showLives(lives : int)
DOMDisplay.prototype.showLives = function(lives) {
    this.scoreboard.textContent = "Lives: " + lives;
}

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
        
var a1 = simpleLevel._actor(new Vector(4,4)); // The player.
expect(a1.pos.x, 4);
expect(a1.pos.y, 3.5);
var a2 = simpleLevel._someActor(); // Lava @ Vector(17,2) @ grid[2][17].
expect(a2.pos.x, 17);
expect(a2.pos.y, 2);
var a3 = simpleLevel._actor(new Vector(17,2)); // Lava @ Vector(17,2) @ grid[2][17].
expect(a3.pos.x, 17);
expect(a3.pos.y, 2);

tprint("### 300 Actors and actions");

//
// 300 Lava
// 

var maxStep = 0.05;

// Level::animate(step : double, keys : KEYS)
Level.prototype.animate = function(step, keys) {
    if (this.status != null)
        // => The game is over (won or lost).
        this.finishDelay -= step;
    
    while (step > 0) {
        var thisStep = clamp(step, 0, maxStep);
        this.actors.forEach(function(actor) {
            actor.act(thisStep, this, keys);
        }, this);
        step -= thisStep;
    }
};

// Lava::act(step, level)
Lava.prototype.act = function(step, level) {
    var newPos = this.pos.plus(this.speed.times(step)); 
                    // = pos + speed * step
    if (!level.obstacleAt(newPos, this.size))
        this.pos = newPos;
    else if (this.repeatPos)
        this.pos = this.repeatPos;
    else
        // Bounce back.
        this.speed = this.speed.times(-1);
                    // = speed * -1
}

//
// 301 Coin
//

var wobbleSpeed = 8;
var wobbleDist = 0.07;

// Coin::act(step)
Coin.prototype.act = function(step) {
    this.wobble += step * wobbleSpeed;
    var wobblePos = Math.sin(this.wobble) * wobbleDist;
    this.pos = this.basePos.plus(new Vector(0, wobblePos));
            // = basePos + <0, wobblePos>
};

//
// 301 Player
//

var playerXSpeed = 7;

// KEYS
// -------------
// left : bool
// up : bool
// right : bool

// Player::moveX(step, level, keys : KEYS)
Player.prototype.moveX = function(step, level, keys) {
    this.speed.x = 0;
    if (keys.left && level.status != "lost") this.speed.x -= playerXSpeed;
    if (keys.right && level.status != "lost") this.speed.x += playerXSpeed;
    var motion = new Vector(this.speed.x * step, 0); 
    var newPos = this.pos.plus(motion);
                // = pos + motion
    var obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle)
        level.playerTouched(obstacle);
    else
        this.pos = newPos;
}

var gravity = 30;
var jumpSpeed = 17;

// Player::moveY(step, level, keys : KEYS) 
Player.prototype.moveY = function(step, level, keys) {
    this.speed.y += step * gravity;
    var motion = new Vector(0, this.speed.y * step);
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle) {
        level.playerTouched(obstacle);
        if (level.status == "lost")
            this.speed.y = 0;
        else if (keys.up && this.speed.y > 0)
            // => Player is moving down and hit an obstacle.
            this.speed.y = -jumpSpeed; // Jump back up.
        else
            this.speed.y = 0;
    } 
    else {
        this.pos = newPos;
    }
}

// Player::act(step, level, keys : KEYS)
Player.prototype.act = function(step, level, keys) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);
    
    var otherActor = level.actorAt(this);
    if (otherActor)
        // => otherActor collided with player.
        level.playerTouched(otherActor.type, otherActor);
        
    if (level.status == "lost") {
        // Losing animation.
        this.pos.y += step;
        this.size.y -= step;
    }
};

//
// 303 Level
//

// Level::playerTouched(type, actor) 
Level.prototype.playerTouched = function(type, actor) {
    if (type == "lava" && this.status == null) {
        this.status = "lost";
        this.finishDelay = 1;
    }
    else if (type == "coin") {
        // Remove actor (the coin) from level.actors.
        this.actors = this.actors.filter(function(a) {
            return a != actor;
        });
        // If there are no more coins, you win.
        if (!this.actors.some(function(a) {
            return a.type == "coin";
        })) {
            this.status = "won";
            this.finishDelay = 1;
        }
    }
};

tprint("### 304 Tracking keys");

// CODES: Mapping of key code => key name.

var arrowCodes /* : CODES */ = {
    37: "left",         // Key code: key name
    38: "up", 
    39: "right"
};

var otherCodes = {
    27: "esc"
};

var _trackKeys__testing = false;

// KEYS: Mapping of key name => bool. 
//      -- true means that key is pressed.

// trackKeys(codes : CODES) : KEYS
function trackKeys(codes /* = arrowCodes */) {
    var pressed = Object.create(null); /* pressed : KEYS */
    // Initialize for convenience.
    var keyCode;
    for (keyCode in codes) {
        pressed[codes[keyCode]] = false;
    }
    function handler(ev) {
        if (in_(ev.keyCode, codes)) { // (ev.keyCode in codes)
            var down = ev.type == "keydown";
            pressed[codes[ev.keyCode]] = down;
            // Prevent keys from scrolling the page.
            ev.preventDefault(); 
            if (_trackKeys__testing) {
                if (typeof trackKeys.counter == 'undefined' ) 
                    trackKeys.counter = 0;
                console.log(++trackKeys.counter, pressed);
            }
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

tprint("### 305 Running the game");

// FRAMEFUNC: frameFunc(timeStep : double) : bool 
//      -- Should return false (not undefined) to signal stop of animation.

function runAnimation(frameFunc) {
    var lastTime = null;
    // FRAME: frame(time : long)
    function frame(time) {
        var stop = false;
        if (lastTime != null) {
            var timeStep = clamp(time - lastTime, 0, 100) / 1000;
            stop = frameFunc(timeStep) === false;
        }
        lastTime = time;
        if (!stop) {
            requestAnimationFrame(frame);
        }
    }
    requestAnimationFrame(frame);
}

var arrows = trackKeys(arrowCodes);

////
////

var _trackKeys2__testing = false;
function trackKeys2(codes /* = arrowCodes */) {
    var pressed = Object.create(null); /* pressed : KEYS */
    // Initialize for convenience.
    var keyCode;
    for (keyCode in codes) {
        pressed[codes[keyCode]] = false;
    }
    var prevPressedCode = null;
    function handler(ev) {
        if (typeof trackKeys2.counter == 'undefined' ) 
            trackKeys2.counter = 0;
        if (in_(ev.keyCode, codes)) { // (ev.keyCode in codes)
            var up = ev.type == "keyup";
            if (up && !pressed[codes[ev.keyCode]]) {
                prevPressedCode = null;
            }
            var down = ev.type == "keydown";
            var activated = down && (prevPressedCode != ev.keyCode);
            if (!prevPressedCode) {
                if (_trackKeys2__testing) console.log(++trackKeys2.counter, "activated", activated, "down", down);
            }
            if (down)
                prevPressedCode = ev.keyCode;
            if (!pressed[codes[ev.keyCode]])
                pressed[codes[ev.keyCode]] = activated;
            // Prevent keys from scrolling the page.
            ev.preventDefault(); 
            if (_trackKeys2__testing) {
                if (typeof trackKeys2.counter == 'undefined' ) 
                    trackKeys2.counter = 0;
            }
        }
        else {
            prevPressedCode = null;
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

////
////

// THENFN: andThen(status : str)

function runLevel(level, Display /* : Display */, andThen /* : THENFN */, lives) {
    var myCounter = 0;
    var display = new Display(document.body, level);
    display.showLives(lives);
    _trackKeys2__testing = false;
    var otherKeys = trackKeys2(otherCodes);
    var paused = false;
    runAnimation(function(step) {
        if (!paused) {
            level.animate(step, arrows);
            display.drawFrame(step);
        }
        if (level.isFinished()) {
            display.clear();
            if (andThen)
                andThen(level.status);
            return false;
        }
        if (otherKeys.esc) {
            otherKeys.esc = false;
            console.log(++myCounter, "Esc pressed.");
            paused = !paused;
        }
    });
}

function runGame(plans /* : str[] */, Display) {
    var lives = 3;
    //var keys2 = trackKeys2(otherCodes);
    function startLevel(n) {
        var level = new Level(plans[n]);
        runLevel(level, Display, function(status) {
            if (status == "lost") {
                if (--lives == 0)
                    console.log("Game over.");
                else {
                    console.log("Lives:", lives);
                    startLevel(n);
                }
            }
            else if (n < plans.length - 1)
                startLevel(n + 1);
            else
                console.log("You win!");
        }, lives);
    }
    startLevel(0);
}

if(0) {
    var _simpleLevels = [
        [
            "                      ",
            "                      ",
            "  x              = x  ",
            "  x         o o    x  ",
            "  x @      xxxxx   x  ",
            "  xxxxx            x  ",
            "      x!!!!!!!!!!!!x  ",
            "      xxxxxxxxxxxxxx  ",
            "                      ",
        ],
        [
            "                      ",
            "                      ",
            "  xxxx           = x  ",
            "  x         o o    x  ",
            "  x @      xxxxx   x  ",
            "  xxxxx            x  ",
            "      x!!!!!!!!!!!!x  ",
            "      xxxxxxxxxxxxxx  ",
            "                      ",
        ],
        [
            "                      ",
            "                      ",
            "            xx        ",
            "  xxxx   x x     = x  ",
            "  x        xo o    x  ",
            "  x @      xxxxx   x  ",
            "  xxxxx            x  ",
            "      x!!!!!!!!!!!!x  ",
            "      xxxxxxxxxxxxxx  ",
        ],
    ];
    runGame(_simpleLevels, DOMDisplay);
    return;
}
    
runGame(GAME_LEVELS, DOMDisplay);

}); /* $(document).ready */

