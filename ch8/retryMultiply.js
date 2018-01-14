// retryMultiply. Chapter 8, Exercise 1. Retry.
"use strict";

function failure() {
    if (typeof failure.counter == 'undefined') 
        failure.counter = 0;
    
    if (failure.counter++ < 1000)
        return true;
    if (failure.counter == 2000) {
        failure.counter = 0;
        return true;
    }
    return false;
}

// MultiplicatorUnitFailure : Error
// --------------------------------
function MultiplicatorUnitFailure(message) {
    this.message = message;
    this.stack = (new Error()).stack;
}

MultiplicatorUnitFailure.prototype = Object.create(Error.prototype);
MultiplicatorUnitFailure.prototype.name = "MultiplicatorUnitFailure";
    
function primitiveMultiply(a, b) {
    if (failure()) 
        throw new MultiplicatorUnitFailure();
    return a * b;
}

// multiply(a, b) -- Wrapper for primitiveMultiply().
function multiply(a, b) {
    var MaxTries = 10000;
    for (var chance = 0; ; chance++) {
        try {
            return primitiveMultiply(a, b);
        } catch(e) {
            if (e instanceof MultiplicatorUnitFailure) {
                if (chance < MaxTries)
                    continue;
                // Exceeded maximum number of tries:
                throw e;
            }
            throw e;
        }
    }
}
            
for (var i = 0; i < 10; i++) {
    console.log(multiply(i+1, i+2));
}
