// ageDifference. Chapter 5, Exercise 2. Mother-child age difference.
"use strict";
var ancestry = JSON.parse(ANCESTRY_FILE);

function byName(name) {
    return function(p) { return p.name == name; }
}

function hasMother(mother) {
    return function(p) { return p.mother == mother; }
}

function ageDiff(motherBorn, child) {
    return child.born - motherBorn;
}

//
//

var calcAvgAgeDiff = (function(ancestry) {
    var motherNames = {};
    ancestry.forEach(function(p) { 
        if (!(p.mother in motherNames)) {
            motherNames[p.mother] = true;
        }
    });

    var n = 0;
    var t = 0;
    for (var motherName in motherNames) {
        var mothers = ancestry.filter(byName(motherName));
        if (mothers.length == 0) 
            continue;
        var mother = mothers[0];
        ancestry.filter(hasMother(mother.name)).forEach(function(child) { 
            t += ageDiff(mother.born, child);
            n += 1;
        });
    }
    return t/n;
});

console.log("Average age difference: " + calcAvgAgeDiff(ancestry));
