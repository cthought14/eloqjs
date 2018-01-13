// SmartPlantEater. Chapter 7, Exercise 1. Artificial stupidity.
"use strict";

// SmartPlantEater "S"
function SmartPlantEater() {
    this.energy = 20;
    this.direction = randomElement(directionNames);
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

var valley_exr1 = new LifelikeWorld([
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
], {"#": Wall,
    "S": SmartPlantEater,
    "*": Plant}
);

//animateWorld(valley_exr1);
