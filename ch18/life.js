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
            var ch = plan[x][y];
            row.push(ch != " ");
        }
        this.cells.push(row);
    }
}

// LifeGrid::turn()
/*    Vector.prototype.plus = function(otherVector) {
        return new Vector(this.x + otherVector.x, 
                          this.y + otherVector.y);
    };
*/
LifeGrid.prototype.turn = function() {
    // Initialize.
    this.newCells = [];
    for (var x = 0; x < this.width; x++) {
        var row = [];
        for (var y = 0; y < this.height; y++) {
            //if (x == 2 && y == 0)
            //    debugger;
            row.push(this.cells[x][y]);
        }
        this.newCells.push(row);
    }
    //debugger;
    /* 
    If cell is alive:
        If neighbors(cell) < 2 || 
           neighbors(cell) > 3:
            Cell dies.
    Else:
        If neighbors(cell) == 3:
            Cell lives.
    */
    // Populate.
    for (y = 0; y < this.height; y++) {
        for (x = 0; x < this.width; x++) {
            //if (x == 2 && y == 0)
            //    debugger;
            if (this.cells[x][y]) {
                if (neighbors(this.cells, x, y) < 2 ||
                    neighbors(this.cells, x, y) > 3)
                {
                    this.newCells[x][y] = false;
                }
            }
            else {
                if (neighbors(this.cells, x, y) == 3)
                    this.newCells[x][y] = true;
            }
        }
    }
    this.cells = this.newCells;
}    

// LifeGrid::logCells()
LifeGrid.prototype.logCells = function() {
    var log = "";
    var line;
    
    line = "|"
    for (var i = 0; i < this.width; i++)
        line += "-";
    log += line + "|\n";

    for (var y = 0; y < this.height; y++) {
        line = "|";
        for (var x = 0; x < this.width; x++) {
            if (this.cells[x][y]) 
                line += "*";
            else
                line += " ";
        }
        log += line + "|\n";
    }

    line = "|"
    for (var i = 0; i < this.width; i++)
        line += "-";
    log += line + "|\n";

    console.log(log);
}


var g1 = new LifeGrid(
["   *",
 " *  ",
 "  * ",
 "    ",
]);

expect(g1.width, 4);
expect(g1.height, 4);
expect(!!g1.cells[0][3], false);
expect(!!g1.cells[3][0], true);

expect(neighbors(g1.cells, 1, 1), 1);
expect(neighbors(g1.cells, 1, 2), 2);
expect(neighbors(g1.cells, 2, 2), 1);
expect(neighbors(g1.cells, 2, 1), 3);

function neighbors(cells, cx, cy) {
    var height = cells.length;
    var width = cells[0].length;

    function onGrid(xx, yy) {
        return xx >= 0 && xx < width && 
               yy >= 0 && yy < height;
    }
   
    function hasNeighbor(xx, yy) {
        return onGrid(xx, yy) &&
               cells[xx][yy];
   }
    
    var ns = 0;
    if (hasNeighbor(cx-1,cy-1)) ns += 1;
    if (hasNeighbor(cx  ,cy-1)) ns += 1;
    if (hasNeighbor(cx+1,cy-1)) ns += 1;
    if (hasNeighbor(cx-1,cy  )) ns += 1;
    if (hasNeighbor(cx+1,cy  )) ns += 1;
    if (hasNeighbor(cx-1,cy+1)) ns += 1;
    if (hasNeighbor(cx  ,cy+1)) ns += 1;
    if (hasNeighbor(cx+1,cy+1)) ns += 1;
    return ns;
}

var g2 = new LifeGrid(
["  **",
 "* * ",
 "    ",
 "    ",
]);

g2.logCells();
g2.turn();
g2.logCells();
g2.turn();
g2.logCells();
    
    
}); /* $(document).ready */

