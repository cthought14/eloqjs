// Seq. Chapter 6, Exercise 3. Sequence interface.
"use strict";

// --------------------------------------------
// Seq
// --------------------------------------------
// start() 
//      -- Go to the beginning of the sequence.
// next() 
//      -- Get the next element in the sequence.
// hasNext()
//      -- true if it is not the end of the 
//      sequence.

function EvenNumbersLessThan10() {}

EvenNumbersLessThan10.prototype.start = function() {
    this._evenNumber = 2;
}

EvenNumbersLessThan10.prototype.next = function() {
    if (!this.hasNext()) return undefined;
    var n = this._evenNumber;
    this._evenNumber += 2;
    return n;
}

EvenNumbersLessThan10.prototype.hasNext = function() {
    return this._evenNumber < 10;
}

function logFive(seq) {
    seq.start();
    for (var i = 0; i < 5; i++) {
        if (!seq.hasNext()) return;
        console.log(seq.next());
    }
}

function _toArray(seq) {
    var arr = [];
    seq.start();
    while (seq.hasNext())
        arr.push(seq.next());
    return arr;
}

console.log("Even numbers less than 10:");
logFive(new EvenNumbersLessThan10()); 
expect(_toArray(new EvenNumbersLessThan10()), [2,4,6,8]);

//
//

function ArraySeq(arr) {
    this._arr = arr;
    this.start = function() {
        this._i = 0;
    };
    this.next = function() {
        return this._arr[this._i++];
    };
    this.hasNext = function() {
        return this._i < this._arr.length;
    };
}
    
console.log("logFive on array sequence with 3 elements:");    
logFive(new ArraySeq([10,20,30]));

console.log("logFive on array seuqnece with 5 elements:");    
logFive(new ArraySeq([10,20,30,40,50]));

console.log("logFive on array sequence with 10 elements:");    
logFive(new ArraySeq([10,20,30,40,50,60,70,80,90,100]));

//
//

function RangeSeq(from, to) {
    this.start = function() {
        this._cur = from;
    };
    this.next = function() {
        return this._cur++;
    };
    this.hasNext = function() {
        return this._cur <= to;
    };
};

expect(_toArray(new RangeSeq(0,0)), [0]);
expect(_toArray(new RangeSeq(1,0)), []);
expect(_toArray(new RangeSeq(1,3)), [1,2,3]);
expect(_toArray(new RangeSeq(6,9)), [6,7,8,9]);
expect(_toArray(new RangeSeq(-3,0)), [-3,-2,-1,0]);

function _takeN(seq, n) {
    var arr = [];
    seq.start();
    for (var i = 0; i < n; i++) {
        if (!seq.hasNext()) 
            break;
        arr.push(seq.next());
    }
    return arr;
}
    
expect(_takeN(new RangeSeq(1,10), 3), [1,2,3]);
// Representing a very long sequence should be cheap:
expect(_takeN(new RangeSeq(1,2000000000), 3), [1,2,3]);
// Trying to turn a very long sequence into an array will not be cheap.
// Uncomment next line to try to overload your browser. You will probably 
// need to manually kill the script.
//expect(_toArray(new RangeSeq(1,2000000000)).slice(0,3), [1,2,3]);

//
//
