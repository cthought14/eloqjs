// lifeExpectancy. Chapter 5, Exercise 3. Historical life expectancy.
"use strict";
var ancestry = JSON.parse(ANCESTRY_FILE);

function century(person) { return Math.ceil(person.died / 100); }
function age(person) { return person.died - person.born; }

function calcLifeExpectancy(ancestry) {
    var calc = {};
    calc.century = {};
    ancestry.forEach(function(person) {
        var c = century(person);
        var a = age(person);
        if (!(c in calc.century)) 
            calc.century[c] = {t: 0, n: 0};
        calc.century[c].t += a;
        calc.century[c].n += 1;
    });

    // Translate calc (intermediate results) to results.
    var results = {};
    results.century = {};
    for (var c in calc.century) {
        results.century[c] = {avgAge: calc.century[c].t / calc.century[c].n};
    }
    return results;
}

// Calculate and print results.
var r = calcLifeExpectancy(ancestry);
for (var c in r.century) {
    console.log("Century: " + c + ", average age: " + r.century[c].avgAge);
}
