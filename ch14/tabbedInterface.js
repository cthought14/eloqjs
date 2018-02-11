// tabbedInterface. Chapter 14 (Handling Events), Exercise 3. Tabs.
"use strict";

$(document).ready(function() {

asTabs(document.querySelector("#tabContent1"));

function asTabs(tabContent_node) {

    // unhide(child)
    var unhide = function(child) {
        child.style.display = '';
    };
    // hide(child)
    var hide = function(child) {
        child.style.display = 'none';
    }
    // activate(button)
    var activate = function(button) {
        button.style="border-top: 3px solid orange;"    
    };
    // deactivate(button)
    var deactivate = function(button) {
        button.style="border-top: 3px solid #eee;"
    };

    var tabNames = new Array();
    var tabList = new Array();
    var buttonList = new Array();
    
    forEach(tabContent_node.childNodes, function(child) {
        if (child.nodeType != document.ELEMENT_NODE)
            return;
        var tabName;
        if ((tabName = child.getAttribute("data-tabname")) !== null) {
            tabNames.push(tabName);
            tabList.push(child);
        }
    });
    
    var ul;
    var li;
    var div;
    tabContent_node.prepend(div = elt("div"));
    tabContent_node.prepend(ul = elt("ul"));
    ul.className = "tabBar";
    div.style = "clear:left;";
            
    tabNames.forEach(function(tabName) {
        ul.appendChild(
            li = elt("li", elt("button", tabName))
        );
        buttonList.push(li.childNodes[0]);
        
        $(li.childNodes[0]).click(function(ev) {
            tabList.forEach(function(child) {
                if (child.getAttribute("data-tabname") == tabName)
                    unhide(child);
                else
                    hide(child);
            });
            var self = this;
            forEach(buttonList, function(button) {
                if (button == self)     
                    activate(button);
                else
                    deactivate(button);
            });
        });
    });
    
    // Begin with tab 0 selected.
    
    forEach(tabList, function(tab, i) {
        if (i == 0)     unhide(tab);
        else            hide(tab);
    });
    
    forEach(buttonList, function(button, i) {
        if (i == 0)     activate(button);
        else            deactivate(button);
    });    
}

}); /* $(document).ready */
