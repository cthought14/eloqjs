// all. Chapter 17, Exercise 2. Waiting for multiple promises.
"use strict";

$(document).ready(function() {

//
// Exercise 2 -- Waiting for multiple promises
//
tprint("### Exercise 2");

// Example for making a promise.

function getPositive(x) {
    return new Promise(function(succeed, fail) {
        if (x <= 0)
            fail(""+x.toString()+": Not positive");
        else
            succeed(x);
    });
}

if(0)(function(){
    getPositive(0).then(function(x) {
        console.log(""+x.toString()+".");
    },
    function(error) {
        console.log("Error: "+error.toString());
    });
})();

// How to use Promise.all().

if(1)(function(){

    var promises = [];
    for (var x = 1; x <= 10; x++) 
        promises.push(getPositive(x));
    promises.push(getPositive(-100));

    Promise.all(promises).then(function(xs) {
        forEach(xs, function(x) {
            console.log(""+x.toString()+".");
        });
    }, 
    function(error) {
        console.log("Error: "+error.toString());
    });

})();

// Now try to use my own all().

function my_all(promises) {
    console.log(">>> (1) typeof promises: " + typeof promises);
    
    var results = [];
    function push_result(x) {
        results.push(x);
    }
    
    var errors = [];
    function push_error(x) {
        errors.push(x);
    }
    
    return new Promise(function(succeed, fail) {
        
        //var results = [];
        //var errors = [];
        console.log(">>> (2) promises " + promises.toString());
        
        forEach(promises, function(promise) {
            /*
            promise.then(function(x) {
                //results.push(x);
                push_result(x);
                console.log(">>> (2.1) push (length: " + results.length + ")");
                succeed(x);
            }, 
            function(error) {
                console.log(">>> (3) error: " + error.toString() );
                //errors.push(error);
                push_error(error);
                fail(error);
            });
            */
            promise.catch(function(error) {
                console.log(">>> (3.1) error: " + error.toString());
                fail(error);
            });
            promise.then(function(x) {
                console.log(">>> (3.2) succeed");
            });
        });
        /*
        console.log(">>> (4) results length: " + results.length.toString());
        console.log(">>> (5) errors length: " + errors.length.toString());
        if (errors.length > 0) {
            fail(errors[0]);
        }
        else {
            succeed(results);
        }
        */
    });
}

// TODO - Does not work properly if there is no error.
if(0)(function(){

    var promises = [];
    for (var x = 1; x <= 10; x++) 
        promises.push(getPositive(x));
    promises.push(getPositive(-100));

    console.log(">>> (0) typeof promises: " + typeof promises);
    my_all(promises).then(function(xs) {
        console.log("then");
        /*
        forEach(xs, function(x) {
            console.log(""+x.toString()+".");
        });
        */
    }, 
    function(error) {
        console.log("error");
        /*
        console.log("Error: "+error.toString());
        */
    });

})();

/*
    return new Promise(function(succeed, fail) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.overrideMimeType("text/plain");
        req.addEventListener("load", function() {
            if (req.status < 400)
                succeed(req.responseText);
            else
                fail(new Error("Request failed: " + req.statusText));
        });
        req.addEventListener("error", function() {
            fail(new Error("Network error"));
        });
        req.send(null);
    });

*/

    
}); /* $(document).ready */

