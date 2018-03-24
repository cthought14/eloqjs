// jsWorkbench. Chapter 18 (Forms and Form Fields), Exercise 1. A JavaScript workbench.
"use strict";

$(document).ready(function() {

//
// Exercise 1
//
tprint("### Exercise 1 - A JavaScript workbench");

var evaluate = document.querySelector("#evaluate");
evaluate.addEventListener("click", function(ev) {
    console.log("click");
    ev.preventDefault();
    
    var exercise1 = document.querySelector("#exercise1");
    //console.log(exercise1.value);
    var f = new Function("", exercise1.value);
    var result = f();
    console.log("result", result);
    var result1 = document.querySelector("#result1");
    result1.textContent = result;
});


}); /* $(document).ready */

