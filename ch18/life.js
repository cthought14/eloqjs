// life. Chapter 18, Exercise 3. Conway's Game of Life.
"use strict";

$(document).ready(function() {

//
// Exercise 3
//
tprint("### Exercise 3 (life)");

// LifeGrid
// --------------
// cells: boolean[][]
// LifeGrid(plan: str[])
// turn()
// width : int
// height : int

// LifeGrid::LifeGrid(plan: str[])
function LifeGrid(plan)
{
    this.width = plan[0].length;
    this.height = plan.length;
    this.cells = [];
    
    for (var y = 0; y < this.height; y++) {
        var row = [];
        for (var x = 0; x < this.width; x++) {
            var ch = plan[y][x];
            row.push(ch != " ");
        }
        this.cells.push(row);
    }
}

var g1 = new LifeGrid(
["   *",
 " *  ",
 "  * ",
 "    ",
]);

expect(g1.width, 4);
expect(g1.height, 4);
expect(!!g1.cells[0][3], true);
expect(!!g1.cells[3][0], false);



    
    
}); /* $(document).ready */

