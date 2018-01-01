// range. Chapter 4, Exercise 1. The sum of a range.
"use strict";

function range(start, end, step) {
    if (typeof step === 'undefined')
        step = 1;
     
    var nums = [];
    
    if (step > 0)
        var inRange = function(a,b) { return a <= b; }
    else if (step < 0)        
        var inRange = function(a,b) { return a >= b; }
            
    for (var num = start; inRange(num, end); num += step) {
        nums.push(num);
    }
    return nums;
}

function sum(nums) {
    var sumResult = 0;
    nums.forEach(function(x){ sumResult += x; });
    return sumResult;
}

expect(sum(range(0,0)), 0);
expect(sum(range(0,1)), 1);
expect(sum(range(1,3)), 6);
expect(sum(range(1,10)), 55);
expect(range(1,10,2), [1, 3, 5, 7, 9]);
expect(range(5,2,-1), [5, 4, 3, 2]);

