// Chapter 8.
"use strict";

//
// 163
//
console.log("### Testing");

Vector // from Vector.js

function testVector() {
    var p1 = new Vector(10, 20);
    var p2 = new Vector(-10, 5);
    var p3 = p1.plus(p2);
    
    expect(p1.x, 10);
    expect(p1.y, 20);
    expect(p2.x, -10);
    expect(p3.x, 0);
    expect(p3.y, 25);
}

if(0)
testVector();

//
// 165
//
console.log("### Debugging");

function numberToString(n, base) {
    var result = "", sign = "";
    if (n < 0) {
        sign = "-";
        n = -n;
    }
    do {
        //console.log(">>> "+n);
        //debugger;
        result = String(n % base) + result;
        n = Math.floor(n / base);  // n /= base;
    } while (n > 0);
    return sign + result;
}

expect(numberToString(255, 8), 377);

//
// 166
//
console.log("### Error propagation");

function promptNumber(question) {
    var result = Number(prompt(question, ""));
    if (isNaN(result)) return null;
    else return result;
}

if(0)
console.log(promptNumber("How many trees do you see?"));

// 173

// Error
// ----------------
// message : string
// stack
// name : string

// InputError : Error
// -------------------
function InputError(message) {
    this.message = message;
    this.stack = (new Error()).stack;
}

InputError.prototype = Object.create(Error.prototype);
InputError.prototype.name = "InputError";

//
// 168
//
console.log("### Exceptions");

function promptDirection(question) {
    var result = prompt(question, "");
    var resultLower = result.toLowerCase();
    if (resultLower == "left") return "L";
    if (resultLower == "right") return "R";
    throw new InputError("Invalid direction: " + result);
}

function look() {
    if (promptDirection("Which way?") == "L")
        return "a house";
    else
        return "two angry bears";
}

if(0) {
try {
    console.log("You see", look());
} catch(error) {
    console.log("Something went wrong: " + error);
}
}

//
// 169 
//
console.log("### Cleaning up after exceptions");

var context = null;

function withContext(newContext, body) {
    var oldContext = context;
    context = newContext;
    try {
        var result = body();
    } finally {
        context = oldContext;
    }
    return result;
}

try {
    withContext(5, function() {
        if (context < 10)
            throw new Error("Not enough context!");
    });
} catch (e) {
    console.log("Ignoring: " + e);
}

expect(context, null);

//
// 171
//
console.log("### Selective catching");

if(0){
for (;;) {
    try {
        // Misspelled promptDirection:
        //var dir = promtDirection("Where?");
        var dir = promptDirection("Where?");
        console.log("You chose ", dir);
        break;
    } catch (e) {
        if (e instanceof InputError)
            console.log("Not a valid direction. Try again.");
        else
            throw e;
    }
}
}

//
// 173
//
console.log("### Assertions");

// AssertionFailed : Error
// -----------------------
function AssertionFailed(message) {
    this.message = message;
}

AssertionFailed.prototype = Object.create(Error.prototype);

function assert(test, message) {
    if (!test)
        throw new AssertionFailed(message);
}

function lastElement(array) {
    assert(array.length > 0, "lastElement requires a non-empty array");
    return array[array.length - 1];
}

var a1 = [10,20,30];
expect(lastElement(a1), 30);
var a2 = [];
try {
    console.log(lastElement(a2));
} catch(e) {
    console.warn("e: " + e);
}
