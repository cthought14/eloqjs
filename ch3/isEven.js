// isEven. Chapter 3, Exercise 2. Recursion.
"use strict";

function isEven(x) {
    if (x == 0)
        return true;
    if (x == 1)
        return false;
    if (x < 0)
        return isEven(-x);
    return isEven(x - 2);
}

expect(isEven(50), true);
expect(isEven(75), false);
expect(isEven(-1), false);
