// isNumber. Chapter 9, Exercise 3. Numbers again.
"use strict";

function isNumber(text) {
    // Optional plus or minus.
    // Number part: Just digits, digits and dot, dot and digits, or 
    // digits dot and digits.
    // Optional exponent part: E, optional sign, digits.
    var re = /^[+-]?(\d+|\d+[.]|[.]\d+|\d+[.]\d+)([eE][+-]?\d+)?$/;
    return re.test(text);
}

expect(isNumber("123"), true);
expect(isNumber("+123"), true);
expect(isNumber("-456"), true);
expect(isNumber("9e3"), true);
expect(isNumber("9e+3"), true);
expect(isNumber("9e-3"), true);
expect(isNumber("1E10"), true);
expect(isNumber("123."), true);
expect(isNumber("123.45"), true);
expect(isNumber("123.0"), true);
expect(isNumber("1."), true);
expect(isNumber("."), false);
expect(isNumber(".1"), true);
expect(isNumber("123.e+1"), true);
expect(isNumber("123.45e+4"), true);
expect(isNumber("123h"), false);
expect(isNumber("0x10"), false);
expect(isNumber("0000.1000"), true);
expect(isNumber("0377"), true);
