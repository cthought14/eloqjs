// Chapter 11.
"use strict";

//
// 217
//
console.log("### Parsing");

function parseExpression(program) {
    program = skipSpace(program);
    var match, expr;
    if (match = /^"([^"]*)"/.exec(program)) // => Egg String
        expr = {type: "value", value: match[1]};
    else if (match = /^\d+\b/.exec(program)) // => Egg Number
        expr = {type: "value", value: Number(match[0])};
    else if (match = /^[^\s(),"]+/.exec(program)) // => Egg Identifier (Word)
        expr = {type: "word", name: match[0]};
    else
        throw new SyntaxError("Unexpected syntax: " + program);
    return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
    var first = string.search(/\S/);
    if (first == -1) return "";
    return string.slice(first);
}

expect(skipSpace("    Hello"), "Hello");
expect(skipSpace("Goodbye"), "Goodbye");


console.log("TODO");

