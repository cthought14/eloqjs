// Chapter 20 (Node.js)
"use strict";

//
// 392
//

// garble(string : String) : String
module.exports = function(string) {
    return string.split("").map(function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) + 5);
    }).join("");
};

