// Chapter 18 (Forms and Form Fields).
"use strict";

var list;
var notes;
var current;

var addNote;
var addToList;
var saveToStorage;

$(document).ready(function() {

//
// 354
//
tprint("### 354 Fields");

var select1 = document.querySelector("#select1");
select1.addEventListener("change", function(ev) {
    var value = ev.target.value;
    console.log("change to " + value.toString());
    //console.log(ev);
});

//
// 356
//
tprint("### 356 Focus");
$('#button1').click(function(ev) {
    ev.preventDefault();
    
    var input1 = document.querySelector("#input1");
    input1.focus();
    expect(document.activeElement.tagName, "INPUT");
    input1.blur();
    expect(document.activeElement.tagName, "BODY");
});

//
// 357
//
tprint("### 357 Disabled fields");

//
// 357
//
tprint("### 357 The form as a whole");
var form1 = document.querySelector("#form1");
expect(form1.elements[1].type, "password");
expect(form1.elements.password.type, "password");
expect(form1.elements.name.form == form1, true);
expect(form1.elements[0].form == form1, true);

var form2 = document.querySelector("#form2");
form2.addEventListener("submit", function(ev) {
    console.log("Saving value", form2.elements.value.value);
    // Prevent form from actually being submitted:
    ev.preventDefault();
});

//
// 359
//
tprint("### 359 Text fields");

var KEY_CODE_F2 = 113;

var textarea1 = document.querySelector("#textarea1");
textarea1.addEventListener("keydown", function(ev) {
    if (ev.keyCode == KEY_CODE_F2) {
        replaceSelection(textarea1, "Khasekhemwy");
        ev.preventDefault();
    }
});

function replaceSelection(field, word) {
    var from = field.selectionStart, 
        to = field.selectionEnd;
    field.value = field.value.slice(0, from) + word + 
                  field.value.slice(to);
    // Put cursor after the word.
    field.selectionStart = 
        field.selectionEnd =
        from + word.length;
}

(function(){
    var text = document.querySelector("#input11");
    var output = document.querySelector("#length1");
    text.addEventListener("input", function() {
        output.textContent = text.value.length;
    });
})();

//
// 360
//
tprint("### 360 Checkboxes and radio buttons");
var checkbox1 = document.querySelector("#purple");
checkbox1.addEventListener("change", function() {
    document.body.style.background = 
            checkbox1.checked ? "mediumpurple" : "";
});

var color1 = document.getElementsByName("color1");
function setColor(ev) {
    document.body.style.background = 
            ev.target.value;
}
forEach(color1, function(button) {
    button.addEventListener("change", setColor);
});

//
// 361
//
tprint("### 361 Select fields");
var select2 = document.querySelector("#select2");
var outpu2 = document.querySelector("#output2");
// --Q: According to https://developer.mozilla.org/en-US/docs/Web/Events/change
// the change event is not necessary fired for each change, and maybe the 
// input event should be used instead.
select2.addEventListener("change", function() {
    var number = 0;
    forEach(select2.options, function(option) {
        if (option.selected)
            number += Number(option.value);
    });
    output2.textContent = number;
});

//
// 363
//
tprint("### 363 File fields");
var input2 = document.querySelector("#input2");
input2.addEventListener("change", function() {
    if (input2.files.length > 0) {
        var file = input2.files[0];
        console.log("You chose", file.name);
        if (file.type)
            console.log("It has type", file.type);
    }
});

var input3 = document.querySelector("#input3");
input3.addEventListener("change", function() {
    //console.log("change");
    forEach(input3.files, function(file) {
        //console.log("file",file.name);
        var reader = new FileReader();
        reader.addEventListener("load", function() {
            console.log("File", file.name, "starts with",
                        reader.result.slice(0, 20));
        });
        reader.readAsText(file);
    });
});

// Wrap a FileReader in a Promise.

function readFile(file) {
    return new Promise(function(succeed, fail) {
        var reader = new FileReader();
        reader.addEventListener("load", function() {
            succeed(reader.result);
        });
        reader.addEventListener("error", function() {
            fail(reader.error);
        });
        reader.readAsText(file);
    });
}

var input4 = document.querySelector("#input4");
input4.addEventListener("change", function() {
    console.log("input4 change");
    forEach(input4.files, function(file) {
        console.log("input4 file");
        readFile(file).then(function(result) {
            console.log("File", file.name, "has result",
                        result.slice(0,14),"...");
        });
    });
});

//
// 365
//
tprint("### 365 Storing data client-side");
localStorage.setItem("username", "marijn");
expect(localStorage.getItem("username"), "marijn");
localStorage.removeItem("username");

}); /* $(document).ready */

