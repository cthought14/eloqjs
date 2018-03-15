// Chapter 18 (Forms and Form Fields).
"use strict";

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





}); /* $(document).ready */

