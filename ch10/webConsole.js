// A simple web console for text display purposes.
"use strict";

function showOnConsole(screen) {
    if (typeof showOnConsole.webConsole == "undefined") {
        if ((showOnConsole.webConsole = document.getElementById("webConsole"))) {
            showOnConsole.webConsole.readOnly = true;
        }
    }
    if (!showOnConsole.webConsole) {
        console.warn("Cannot find id 'webConsole'");
        return;
    }
    var webConsole = showOnConsole.webConsole;
    webConsole.value = screen;
}
