// tabbedInterface. Chapter 14, Exercise 3. Tabs.
"use strict";

$(document).ready(function() {

var my_tab1 = document.querySelector("#my_tab1");
var my_tab2 = document.querySelector("#my_tab2");
var my_tab3 = document.querySelector("#my_tab3");

//my_tab1.style.display='none';
my_tab2.style.display='none';
my_tab3.style.display='none';

// How to insert an element before another one. 
// my_tabContent1.insertBefore(document.createElement("p"), my_tab1);

var tabList = new Array();

function asTabs(node) {
    /* Pseudocode.
    
        Let tabList = []. //OK
        
        For each child in node:
            If there is no data-tabname:
                Skip child.
            Create button based on data-tabname. //OK
            Add child to tabList. //OK
        End for each.
        
        Button handler:
            For each child in tabList:
                If child.id == this button's associated tab id: //OK
                    Unhide child. //OK
                Else:
                    Hide child. //OK
            End for each.
        End handler.
    */
}

////
////

var buttonHolder1 = document.querySelector("#buttonHolder1");
var button2;
buttonHolder1.appendChild(
    button2 = elt("button", "Press me")
);

$(button2).click(function(ev) {
    console.log("You clicked the button.");
});

// Creating the tab bar
tprint("#### Create a tab bar");

//        <li><button id="tab1Button" onclick="my_tab1.style.display=''; my_tab2.style.display='none'; my_tab3.style.display='none'; ">
//            Tab 1</button></li>
//var buttonHolder2 = document.querySelector("#buttonHolder2");
var tabContent2 = document.querySelector("#tabContent2");

var tabNames = new Array("My Tab 1", "My Tab 2", "My Tab 3");

var tabList = new Array();
// id="auto_tab1"
tabList.push(document.querySelector("#auto_tab1"));
tabList.push(document.querySelector("#auto_tab2"));
tabList.push(document.querySelector("#auto_tab3"));

unhide(tabList[0]);
hide(tabList[1]);
hide(tabList[2]);

/*
        Button handler:
            For each child in tabList:
                If child.id == this button's associated tab id:
                    Unhide child.
                Else:
                    Hide child.
            End for each.
        End handler.

        */

var ul;
var li;
var div;
tabContent2.prepend(div = elt("div"));
tabContent2.prepend(ul = elt("ul"));
ul.className = "tabBar";
/*
    <div style="clear:left;"></div>
*/
div.style = "clear:left;";
        
tabNames.forEach(function(tabName) {
/*
    buttonHolder2.appendChild(
        li = elt("li", elt("button", tabName))
    );
*/
/*
    <ul class="tabBar" id="buttonHolder2">
        <li><button id="tab1Button" onclick="my_tab1.style.display=''; my_tab2.style.display='none'; my_tab3.style.display='none'; ">
            Tab 1</button></li>
            ...
    </ul>
*/
    ul.appendChild(
        li = elt("li", elt("button", tabName))
    );

    /*
"my_tab1.style.display=''; my_tab2.style.display='none'; my_tab3.style.display='none'; "
    */
    $(li.childNodes[0]).click(function(ev) {
        tabList.forEach(function(child) {
            if (child === null || child.nodeType != document.ELEMENT_NODE)
                return;
            else if (child.getAttribute("data-tabname") == tabName)
                unhide(child);
            else
                hide(child);
        });
    });
});

function unhide(child) {
    //console.log("Unhide "+child.id);
    child.style.display = '';
}

function hide(child) {
    //console.log("Hide "+child.id);
    child.style.display = 'none';
}

////
////

}); /* $(document).ready */
