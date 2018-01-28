// set. Chapter 11, Exercise 4. Fixing scope.
"use strict";

run; // From ch11_notes.js

tprint("## set.js");
tprint("### Exercise 4. Fixing scope.");

// "set"(args, env)
specialForms["set"] = function(args, env) {
    // set(NAME, EXPR)
    if (args.length != 2 || args[0].type != "word")
        throw new SyntaxError("Bad use of set");
    if (!(args[0].name in env))
        throw new ReferenceError(args[0].name + " not defined");
    var value = evaluate(args[1], env);
    env[args[0].name] = value;
    return value;
}

///
///
    
var referenceError;
referenceError = null;
try {
    ret = run(" \
        do( \
            define(i, 0), \
            while(<(i, 3), do( \
                set(x, 999), \
                print(i), \
                set(i, +(i, 1)) \
            )), \
            print(x) \
        ) \
    ");
} 
catch(e) {
    if (e instanceof ReferenceError)
        referenceError = e;
}
// 1.
expect(referenceError.toString(), "ReferenceError: x not defined");

referenceError = null;
try {
    ret = run(" \
        do( \
            define(i, 0), \
            while(<(i, 3), do( \
                define(x, 999), \
                print(i), \
                set(i, +(i, 1)) \
            )), \
            print(x) \
        ) \
    ");
} 
catch(e) {
    if (e instanceof ReferenceError)
        referenceError = e;
}
// 2.
expect(referenceError, null);
