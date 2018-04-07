// Chapter 4.
"use strict";

function showArgs() {
    var args = "";
    function join(piece, glue) {
        if (args.length > 0)
            args += glue;
        args += toString(piece);
    }
    forEach(arguments, function(arg) {
        join(arg, ";");
    });
    console.log(args);
}

showArgs('a','b',123,987.654,"apples",null,"X",undefined,"YYY",{a:123,b:'peaches'},'Z');
