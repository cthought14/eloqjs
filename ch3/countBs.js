// countBs. Chapter 3, Exercise 3. Bean counting.
"use strict";

function countBs(s) {
    return countChar(s, "B");
}

expect(countBs(""), 0);
expect(countBs("B"), 1);
expect(countBs("BB"), 2);
expect(countBs("AAAB"), 1);
expect(countBs("BAAA"), 1);
expect(countBs("BAAB"), 2);
expect(countBs("ABBA"), 2);
expect(countBs("ABbA"), 1);
expect(countBs("baaB"), 1);
console.log('----');

function countChar(s, c) {
    var cs = 0;
    for (var i = 0; i < s.length; i++) {
        if (s.charAt(i) == c) {
            cs++;
        }
    }
    return cs;
}
    
expect(countChar("", "B"), 0);
expect(countChar("B", "B"), 1);
expect(countChar("BB", "B"), 2);
expect(countChar("AAAB", "B"), 1);
expect(countChar("BAAA", "B"), 1);
expect(countChar("BAAB", "B"), 2);
expect(countChar("ABBA", "B"), 2);
expect(countChar("ABbA", "B"), 1);
expect(countChar("baaB", "B"), 1);
console.log('----');

expect(countChar("", "A"), 0);
expect(countChar("B", "A"), 0);
expect(countChar("BB", "A"), 0);
expect(countChar("AAAB", "A"), 3);
expect(countChar("BAAA", "A"), 3);
expect(countChar("BAAB", "A"), 2);
expect(countChar("ABBA", "A"), 2);
expect(countChar("ABbA", "A"), 2);
expect(countChar("baaB", "A"), 0);
console.log('----');
