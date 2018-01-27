// Chapter 11.
"use strict";

//
// 217
//
tprint("### Parsing");

function parseExpression(program) {
    program = skipSpace(program);
    var match, expr;
    if (match = /^"([^"]*)"/.exec(program)) // => Egg String
        expr = {type: "value", value: match[1]};
    else if (match = /^\d+\b/.exec(program)) // => Egg Number
        expr = {type: "value", value: Number(match[0])};
    else if (match = /^[^\s(),"]+/.exec(program)) { // => Egg Identifier (Word)
        //console.log(">>> Found a word: ", match[0]);
        expr = {type: "word", name: match[0]};
    }
    else
        throw new SyntaxError("Unexpected syntax: " + program);
    return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
    var first = string.search(/\S/);
    if (first == -1) return "";
    // Exercise 3 (comments):
    string = string.replace(/#.*/, "");
    return string.slice(first);
}

// 1:
expect(skipSpace("    Hello"), "Hello");
expect(skipSpace("Goodbye"), "Goodbye");

function parseApply(expr, program) {
    program = skipSpace(program);
    if (program[0] != "(") {
        //console.log(">>> parseApply: rest: \""+program+"\"");
        return {expr: expr, rest: program};
    }
    //console.log(">>> parseApply: program: \""+program+"\"");
    
    program = skipSpace(program.slice(1));
    expr = {type: "apply", operator: expr, args: []};
    while (program[0] != ")") {
        var arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if (program[0] == ",") {
            //console.log(">>> parseApply found \",\"");
            program = skipSpace(program.slice(1));
        }
        else if (program[0] != ")") {
            //console.log(">>> parseApply: program: \""+program+"\"");
            throw new SyntaxError("Expected ',' or ')'");
        }
    }
    return parseApply(expr, program.slice(1));
}

function parse(program) {
    var result = parseExpression(program);
    if (skipSpace(result.rest).length > 0)
        throw new SyntaxError("Unexpected text after program");
    return result.expr;
}

console.log(parse("+(a, 10)"));

//
// 222
//
tprint("### The evaluator");

function evaluate(expr, env) {
    switch(expr.type) {
        case "value":
            return expr.value;
        case "word":
            if (expr.name in env)
                return env[expr.name];
            else
                throw new ReferenceError("Undefined variable: " + expr.name);
        case "apply":
            if (expr.operator.type == "word" &&
                        expr.operator.name in specialForms)
                return specialForms[expr.operator.name](expr.args, env);
            var op = evaluate(expr.operator, env);
            if (typeof op != "function")
                throw new TypeError("Applying a non-function.");
            //console.log(">>> op.apply");
            return op.apply(null, expr.args.map(function(arg) {
                return evaluate(arg, env);
            }));
    }
}

//
// 223
//
tprint("### Special forms"); // AKA keywords.
var specialForms = Object.create(null);

// "if"(args, env)
specialForms["if"] = function(args, env) {
    // if(EXPR, IF_TRUE, IF_FALSE)
    if (args.length != 3)
        throw new SyntaxError("Bad number of args to if");
        
    if (evaluate(args[0], env) !== false)
        return evaluate(args[1], env);
    else
        return evaluate(args[2], env);
};

// "while"(args, env)
specialForms["while"] = function(args, env) {
    // while(EXPR, DO_EXPR)
    if (args.length != 2)
        throw new SyntaxError("Bad number of args to while");
    
    while (evaluate(args[0], env) !== false)
        evaluate(args[1], env);
        
    // Everything in Egg has some return value. 
    return false; // --Q: Why not return 'value', similar to "do"?
};

// "do"(args, env)
specialForms["do"] = function(args, env) {
    // do(EXPR1, EXPR2, ...)
    var value = false;
    args.forEach(function(arg) {
        value = evaluate(arg, env);
    });
    return value;
};

// "define"(args, env)
specialForms["define"] = function(args, env) {
    // define(NAME, EXPR)
    if (args.length != 2 || args[0].type != "word")
        throw new SyntaxError("Bad use of define");
    var value = evaluate(args[1], env);
    env[args[0].name] = value;
    return value;
}

//
// 225
//
tprint("### The environment");
var topEnv = Object.create(null);
topEnv["true"] = true;
topEnv["false"] = false;
var prog1 = parse("if(true, false, true)");
// 3:
expect(evaluate(prog1, topEnv), false);
var prog2 = parse("if(true, true, false)");
expect(evaluate(prog2, topEnv), true);

// +(A, B)      -(A, B)
// *(A, B)      /(A, B)
// ==(A, B)     
// <(A, B)      >(A, B)
["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
    topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

// print(VALUE)
topEnv["print"] = function(value) {
    console.log(value);
    // --Q: Why do I not need to call evaluate() for value, as was
    // done in "define"?
    return value;
};

// run(LINE1, LINE2, ...)
function run() {
    var env = Object.create(topEnv);
    // Array.prototype.slice.call(arguments, 0) ==> Convert array-like 
    // object into array.
    var program = Array.prototype.slice.call(arguments, 0).join("\n");
    return evaluate(parse(program), env);
}

/*
    total = 0
    count = 1
    while (count < 11) {
        total = total + count
        count = count + 1
    }
    print(total)
*/
var ret;
ret = run("\
    do( \
        define(total, 0), \
        define(count, 1), \
        while(<(count, 11), \
            do( \
                define(total, +(total, count)), \
                define(count, +(count, 1)) \
            ) \
        ), \
        print(total) \
    ) \
");
// 5:
expect(ret, "55");

//
// 227
//
tprint("### Functions");

// "fun"(args, env)
specialForms["fun"] = function(args, env) {
    // fun(ARGNAME1, ARGNAME2, ..., BODY)
    if (args.length < 1) 
        throw new SyntaxError("Functions need a body");
    function name(expr) {
        if (expr.type != "word")
            throw new SyntaxError("Arg names must be words");
        return expr.name;
    }
    var argNames = args.slice(0, args.length - 1).map(name);
    var body = args[args.length - 1];
    
    return function() {
        if (arguments.length != argNames.length)
            throw new TypeError("Wrong number of arguments");
        // localEnv should have access to the variables in the outer
        // environment as well as new variables created from the 
        // fun arguments.
        var localEnv = Object.create(env);
        //console.log(">>> localEnv: ", localEnv);
        for (var i = 0; i < arguments.length; i++)
            localEnv[argNames[i]] = arguments[i];
        return evaluate(body, localEnv);
    };
};

/* 
    plusOne = function(a) {
        return a + 1
    }
    print(plusOne(10))
*/
ret = run(" \
    do( \
        define(plusOne, fun(a, \
            +(a, 1) \
        )), \
        print(plusOne(10)) \
    ) \
");
// 6:
expect(ret, "11");

/*
    pow = function(base, exp) {
        if (exp == 0)
            return 1
        else
            return base * pow(base, (exp-1))
    }
*/
ret = run(" \
    do( \
        define(pow, fun(base, exp, \
            if(==(exp, 0), \
                1, \
                *(base, pow(base, -(exp, 1))) \
            ) \
        )), \
        print(pow(2, 10)) \
    ) \
");
// 7:
expect(ret, "1024");

//
// 228
//
tprint("### Compilation");
// (EggJs) Suggested exercise: build a version of the Egg evaluator that translates
// an Egg program into a JavaScript program using new Function, and then 
// run the resulting program using JavaScript. It should execute very fast.

//
// 229
//
tprint("### Cheating");

//
// 230
//
tprint("### End of Chapter");
