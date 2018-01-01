// fizzBuzz. Chapter 2, Exercise 2. FizzBuzz.
"use strict";

for (var number = 1; number <= 100; number++) {
    var fizzy = number % 3 == 0;
    var buzzy = number % 5 == 0;
    if (fizzy && !buzzy) {
        console.log("Fizz");
    }
    else if (buzzy && !fizzy) {
        console.log("Buzz");
    }
    else if (fizzy && buzzy) {
        console.log("FizzBuzz");
    }
    else {
        console.log(number);
    }
}
