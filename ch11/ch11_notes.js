// Chapter 11.
"use strict";

//
// 217
//
console.log("### Parsing");

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
    return string.slice(first);
}

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
console.log("### The evaluator");

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
            return op.apply(null, expr.args.map(function(arg) {
                return evaluate(arg, env);
            }));
    }
}

//
// 223
//
console.log("### Special forms"); // AKA keywords.
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
    if (args.length != 2 || args[0].type != "word")
        throw new SyntaxError("Bad use of define");
    var value = evaluate(args[1], env);
    env[args[0].name] = value;
    return value;
}

//
// 225
//
console.log("### The environment");
var topEnv = Object.create(null);
topEnv["true"] = true;
topEnv["false"] = false;
var prog1 = parse("if(true, false, true)");
expect(evaluate(prog1, topEnv), false);
var prog2 = parse("if(true, true, false)");
expect(evaluate(prog2, topEnv), true);


console.log("TODO");

