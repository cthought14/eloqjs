// Chapter 18 (Forms and Form Fields) - Note-taking application.
"use strict";

//
// 366
//

var list;
var notes;
var current;

var addNote;
var addToList;
var saveToStorage;

$(document).ready(function() {

list = document.querySelector("#list");
addToList = function(name) {
    var option = document.createElement("option");
    option.textContent = name;
    list.appendChild(option);
};


notes = JSON.parse(localStorage.getItem("notes")) ||
            {"shopping list": ""};
for (var name in notes)
    if (notes.hasOwnProperty(name))
        addToList(name);

saveToStorage = function() {        
    localStorage.setItem("notes", JSON.stringify(notes));
    
    if (typeof saveToStorage.counter == 'undefined' ) 
        saveToStorage.counter = 0;
    console.log("Saved", ++saveToStorage.counter);
};


current = document.querySelector("#currentnote");
current.value = notes[list.value];

list.addEventListener("change", function() {
    current.value = notes[list.value];
});
current.addEventListener("change", function() {
    notes[list.value] = current.value;
    saveToStorage();
});

addNote = function() {
    var name = prompt("Note name", "");
    if (!name) return;
    if (!notes.hasOwnProperty(name)) {
        notes[name] = "";
        addToList(name);
        saveToStorage();
    }
    list.value = name;
    current.value = notes[name];
};

}); /* $(document).ready */
