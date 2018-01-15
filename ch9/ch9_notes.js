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
console.log(new Date().toString());
expect(new Date(2009, 11, 9).toString().startsWith("Wed Dec 09 2009 00:00:00"), true);
expect(new Date(2009, 11, 9, 12, 59, 59, 999).toString()
            .startsWith("Wed Dec 09 2009 12:59:59"), true);
// "Unix time". Exact value depends on the time zone.            
console.log(new Date(2013, 11, 19).getTime());
var unixTime1 = new Date(2013, 11, 19).getTime();
expect(new Date(unixTime1).toString().startsWith("Thu Dec 19 2013 00:00:00"), true);

function findDate(string) {
    // string: Date in "DD-MM-YYYY" format.
    var dateTime = /\b(\d{1,2})-(\d{1,2})-(\d{4})\b/;
    var match = dateTime.exec(string);
    try {
        return new Date(Number(match[3]),
                        Number(match[2]) - 1,
                        Number(match[1]));
    } catch (e) {
        if (e instanceof TypeError)
            return null;
        throw e;
    }
}
console.log(findDate("30-1-2003"));
function contains(string, needle) { return string.indexOf(needle) != -1; }
expect(contains(findDate("30-1-2003").toString(), "Jan 30 2003"), true);
expect(findDate("100-1-30000"), null);
expect(findDate("10-1-30000"), null);
expect(findDate("Today is 10-1-3000").toString().slice(4,15), "Jan 10 3000");

//
// 183
//
console.log("### Word and string boundaries");
expect(/cat/.test("concatenate"), true);
expect(/\bcat\b/.test("concatenate"), false);

//
// 184
//
console.log("### Choice patterns");
