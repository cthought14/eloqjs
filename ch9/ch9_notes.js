// Chapter 9.
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
var animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
expect(animalCount.test("15 pigs"), true);
expect(animalCount.test("15 pigchickens"), false);

//
// 186
//
console.log("### Backtracking");
var numberLiteral = /\b([01]+b|\d+|[\da-f]+h)\b/;
expect(numberLiteral.test("10101b"), true);
expect(numberLiteral.test("9876543210"), true);
expect(numberLiteral.test("9fh"), true);

var findX = /^.*x/;
console.log(findX.exec("abcxe"));

var worker = /([01]+)+b/;
console.log(worker.exec("1010"));
// Uncomment next line to make the browser do a lot of work:
//console.log(worker.exec("101011111111111111111111111111"));

//
// 188
//
console.log("### The replace method");
expect("papa".replace("p", "m"), "mapa");
expect("Borobudur".replace(/[ou]/, "a"), "Barobudur");
expect("Borobudur".replace(/[ou]/g, "a"), "Barabadar");
expect(
    "Hopper, Grace\nMcCarthy, John\nRitchie, Dennis"
        .replace(/([\w ]+), ([\w ]+)/g, "$2 $1"),
    "Grace Hopper\n"+
    "John McCarthy\n"+
    "Dennis Ritchie"
);

var s1 = "the cia and fbi";
expect(s1.replace(/\b(fbi|cia)\b/g, function(str) {
    return str.toUpperCase();
}),
    "the CIA and FBI"
);

var stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
    console.log(">>> Match: \"" + match + "\"");
    amount = Number(amount) - 1;
    if (amount == 1) // => Remove final 's'.
        unit = unit.slice(0, -1); // --Q: -1 works on my browser. Is it standard?
    else if (amount == 0)
        amount = "no";
    return amount + " " + unit;
}
expect(stock.replace(/(\d+) (\w+)/g, minusOne),
    "no lemon, 1 cabbage, and 100 eggs");

//
// 189
//
console.log("### Greed");
function stripComments(code) {
    // [^] to match any character, including newlines.
    return code.replace(/\/\/.*|\/\*[^]*\*\//g, ""); 
}
expect(stripComments("1 + /* 2 */3"), "1 + 3");
expect(stripComments("x = 10;// ten!"), "x = 10;");
expect(stripComments("1 /* a */+/* b */ 1"), "1 + 1");

// Non-greedy version.
function stripComments_ng(code) {
    return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}
expect(stripComments_ng("1 + /* 2 */3"), "1 + 3");
expect(stripComments_ng("x = 10;// ten!"), "x = 10;");
expect(stripComments_ng("1 /* a */+/* b */ 1"), "1 + 1");

//
// 191
//
console.log("### Dynamically creating RegExp objects");
var name1 = "harry";
var text1 = "Harry is a suspicious character.";
var regexp1 = new RegExp("\\b(" + name1 + ")\\b", "gi");
expect(text1.replace(regexp1, "_$1_"), 
        "_Harry_ is a suspicious character.");

var name2 = "dea+hl[]rd";
var text2 = "This dea+hl[]rd guy is super annoying.";
// Escape everything that's not alphanumeric or whitespace.
var escaped2 = name2.replace(/[^\w\s]/g, "\\$&");
var regexp2 = new RegExp("\\b(" + escaped2 + ")\\b", "gi");
expect(text2.replace(regexp2, "_$1_"),
        "This _dea+hl[]rd_ guy is super annoying.");

//
// 192
//
console.log("### The search method");
// search is to RegExp as indexOf is to string.
expect("  word".search(/\S/), 2);
expect("          ".search(/\S/), -1);

//
// 192
//
console.log("### The lastIndex property");
// Must use /g attribute and .exec() method.
var pattern1 = /y/g;
pattern1.lastIndex = 3; // The index at which scanning begins (normally 0).
var string1 = "xyzzy";
var match1 = pattern1.exec(string1);
expect(match1.index, 4); // Found a "y" at position 4.
expect(pattern1.lastIndex, string1.length); // Scan position is now at the end of the string.

// What actually happens is that when /g "global" is active, and .exec() is used, 
// the lastIndex property gets updated. This can cause unexpected results.
var digit1 = /\d/g;
expect(digit1.exec("here it is: 1"), ["1"].toString());
expect(digit1.exec("and now: 1"), ["1"].toString()); // Oops.

var digit2 = /\d/g;
expect(digit2.exec("here it is: 1"), ["1"].toString());
digit2.lastIndex = 0;
expect(digit2.exec("and now: 1"), ["1"].toString()); 

// When .match() is called on a RegExp with /g enabled, it returns an array result containing
// all of the matches.

console.log("Banana".match(/an/)); // [0] is the entire match, [1] is the first capture group, ...
console.log("Banana".match(/an/g)); // [0] is the first match, [1] is the second match, ...

//
// 193
//
console.log("### Looping over matches");
var input = "A string with 3 numbers in it... 42 and 88.";



