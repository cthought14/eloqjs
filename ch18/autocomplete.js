// autocomplete. Chapter 18 (Forms and Form Fields), Exercise 2. Autocompletion.

"use strict";

$(document).ready(function() {

//
// Exercise 2 (autocomplete).
//
tprint("### Exercise 2 (autocomplete)");

var completions = 
"apple\n\
apricot\n\
banana\n\
blackberry\n\
cantaloupe\n\
cherry\n\
clementine\n\
coconut\n\
cranberry\n\
date\n\
durian\n\
elderberry\n\
fig\n\
grapefruit\n\
grape\n\
guava\n\
honeydew melon\n\
huckleberry\n\
jackfruit\n\
jambolan\n\
kiwifruit\n\
lemon\n\
lime\n\
mango\n\
mandarin orange\n\
nectarine\n\
orange\n\
papaya\n\
passion fruit\n\
peach\n\
pineapple\n\
plum\n\
quince\n\
raisin\n\
raspberry\n\
strawberry\n\
tangerine\n\
watermelon".split("\n");

var exercise2 = document.querySelector("#exercise2");

exercise2.addEventListener("input", function(ev) {
    var value = ev.target.value;
    var candidates = completions.map(function(word) {
        if (word.startsWith(value))
            return word;
    }).filter(function(elem) {
        return typeof elem != "undefined";
    });
    //console.log("Candidates:", candidates);
    
    candidateList = document.querySelector("#candidateList");
    clearNode(candidateList);
    if (candidates.length <= 5) {
        var ul = document.createElement("ul");
        var li;
        var a;
        forEach(candidates, function(candidate) {        
            li = document.createElement("li");
            
            a = document.createElement("a");
            a.href = "#";
            a.appendChild(document.createTextNode(candidate));
            a.addEventListener("click", clicked);
            li.appendChild(a);
            ul.appendChild(li);
        });
        candidateList.appendChild(ul);    
    }
});

function clicked(ev) {
    ev.preventDefault();
    //console.log("clicked", ev.target);
    var target = ev.target;
    console.log(target.innerText);
    
    var text = target.innerText;
    exercise2.textContent = text;
    replaceAll(exercise2, text);
}

function replaceAll(field, text) {
    field.value = text;
    // Put cursor after the text.
    field.selectionStart = 
        field.selectionEnd =
        text.length;
}

}); /* $(document).ready */

