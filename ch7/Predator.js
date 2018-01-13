// Predator. Chapter 7, Exercise 2. Predators.
"use strict";

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
    return {type: "eat", direction: randomElement(directionNames)};
};

var bigValley_exr2 = new LifelikeWorld([
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
], {"#": Wall,
    "S": SmartPlantEater,
    "!": Predator,
    "*": Plant}
);

//animateWorld(bigValley_exr2);
