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

function asTabs(node) {
    /* Pseudocode.
    
        Let tabList = [].
        
        For each child in node:
            If there is no data-tabname:
                Skip child.
            Create button based on data-tabname.
            Add child to tabList.
        End for each.
        
        Button handler:
            For each child in tabList:
                If child.id == this button's associated tab id:
                    Unhide child.
                Else:
                    Hide child.
            End for each.
        End handler.
    */
}


}); /* $(document).ready */
