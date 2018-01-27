// closure. Chapter 11, Exercise 2. Closure.
"use strict";

run; // From ch11_notes.js

tprint("## closure.js");
tprint("### Exercise 2. Closure.");

/*
    f = function(a) {
        return function(b) {
            return a + b
        }
    }
    print(f(4)(5))
*/

ret = run(" \
    do( \
        define(f, fun(a, \
            fun(b, \
                +(a, b) \
            ) \
        )), \
        print(f(4)(5)) \
    ) \
");
// 1:
expect(ret, "9");

// Each function extends the previous environment with the line
// in specialForms["fun"]:
//              var localEnv = Object.create(env);
// Special forms like fun are called by the line
//              return specialForms[expr.operator.name](expr.args, env);
// in evaluate(args, env).

// It works similarly to this JavaScript:

var f = function(a) {
    return function(b) {
        return a + b;
    }
}
// 2:
expect(f(4)(5), 9);
