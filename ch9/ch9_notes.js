// Chapter 8.
"use strict";

//
// 176
//
console.log("### Creating a regular expression");
var re1 = new RegExp("abc");
var re2 = /abc/;

//
// 177
//
console.log("### Testing for matches");
expect(/abc/.test("abcde"), true);
expect(/abc/.test("abxde"), false);

//
// 177
//
console.log("### Matching a set of characters");
var dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/; // E.g. 30-01-2003 15:20
expect(dateTime.test("30-01-2003 15:20"), true);
expect(dateTime.test("30-jan-2003 15:20"), false);

var notBinary = /[^01]/;
expect(notBinary.test("1100100010100110"), false);
expect(notBinary.test("1100100010200110"), true);

//
// 179
//
console.log("### Repeating parts of a pattern");
var dateTime2 = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
expect(dateTime2.test("30-1-2003 8:45"), true);

//
// 180
//
console.log("### Grouping subexpressions");
var cartoonCrying = /boo+(hoo+)+/i;
expect(cartoonCrying.test("Boohoooohoohooo"), true);

//
// 180
//
console.log("### Matches and groups");
var match = /\d+/.exec("one two 100");
console.log(match);
expect(match.index, 8);

console.log("one two 100".match(/\d+/));

var quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));

// If a group is specified but is not actually matched, that position
// will be undefined in the result array.
console.log(/bad(ly)?/.exec("bad"));

// When a group is matched multiple times, only the lasst match ends
// up in the array.
console.log(/(\d)+/.exec("123"));

//
// 182
//
console.log("### The date type");

