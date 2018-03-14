// Chapter 17 (HTTP).
"use strict";

$(document).ready(function() {

//
// 336
//
tprint("### 336 The protocol");

//
// 338
//
tprint("### 338 Browsers and HTTP");
expect(encodeURIComponent("Hello & goodbye"), "Hello%20%26%20goodbye");
expect(decodeURIComponent("Hello%20%26%20goodbye"), "Hello & goodbye");

//
// 340
//
tprint("### 340 XMLHttpRequest");

//
// 340
//
tprint("### 340 Sending a request");
$('#get1').click(function(ev) {
    ev.preventDefault();
    var req = new XMLHttpRequest();
    // If the server does not send a Content-Type, it is assumed to be "text/xml"
    // and Firefox console will complain about XML parse errors if it is not
    // valid.
    req.open("GET", "example/data.txt", false); // false => Not asynchronous.
    req.send(null);
    console.log(req.responseText);
    console.log(req.status, req.statusText); // E.g. 200 OK
    console.log("content-type:", req.getResponseHeader("content-type"));
});

$('#get2').click(function(ev) {
    ev.preventDefault();
    var req = new XMLHttpRequest();
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/overrideMimeType
    req.overrideMimeType("text/plain");
    req.open("GET", "example/data_text.txt", false);
    req.send(null);
    console.log(req.responseText);
    console.log(req.status, req.statusText);
    console.log("content-type:", req.getResponseHeader("content-type"));
});
   
//
// 342
//   
tprint("### 342 Asynchronous Requests");

$("#get3").click(function(ev) { 
    ev.preventDefault();
    var req = new XMLHttpRequest();
    req.open("GET", "example/data_text.txt", true); // true => Asynchronous.
    req.overrideMimeType("text/plain");
    req.addEventListener("load", function() {
        console.log("Done:", req.status);
    });
    req.send(null);
});

//
// 342
//
tprint("### 342 Fetching XML Data");

$("#get4").click(function(ev) {
    ev.preventDefault();
    var req = new XMLHttpRequest();
    req.open("GET", "example/fruit.xml", false);
    req.send(null);
    var doc = req.responseXML;
    
    var fruits = doc.querySelectorAll("fruit");
    var out = "";
    out += "There are "+fruits.length.toString()+" fruits in the XML document:\n";
    forEach(fruits, function(fruit) {
        if(0)(function(){
            for (var n in fruit) {
                console.log(n)
            };
        })();
        out += ""+fruit.getAttribute("name").toString()+"\n";
    });
    console.log(out);
});

// JSON version

$("#get5").click(function(ev) {
    ev.preventDefault();
    var req = new XMLHttpRequest();
    req.open("GET", "example/fruit.json", false);
    req.overrideMimeType("text/plain");
    req.send(null);
    var text = req.responseText;
    
    var fruits = JSON.parse(text);
    var out = "";
    out += "There are "+len(fruits).toString()+" fruits in the JSON document:\n";
    forEach(fruits, function(name, color) {
        out += ""+name.toString()+"\n";
    });
    console.log(out);
});

if(0)(function(){
    var d1 = JSON.parse("{"+
    "    \"banana\": \"yellow\","+
    "    \"lemon\": \"yellow\","+
    "    \"cherry\": \"red\""+
    "}"+
    "");
    console.log((typeof d1), d1.toString());
    console.log("length:",len(d1));
    for (var p in d1) {
        console.log(p, d1[p]);
    }
})();

//
// 343
//    
tprint("### 343 HTTP sandboxing");
    
//
// 344
//
tprint("### 344 Abstracting requests");

// Version without error handling.

function backgroundReadFile(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.overrideMimeType("text/plain");
    req.addEventListener("load", function() {
        if (req.status < 400)
            callback(req.responseText);
    });
    req.send(null);
}

$("#get6").click(function(ev) {
    ev.preventDefault();
    backgroundReadFile("data/file1.txt", function(text) {
        console.log("file1.txt:",text);
    });
});

// Version with error handling.

function getURL(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.overrideMimeType("text/plain");
    req.addEventListener("load", function() {
        if (req.status < 400)
            callback(req.responseText);
        else
            callback(null, new Error("Request failed: " + req.statusText));
    });
    req.addEventListener("error", function() {
        callback(null, new Error("Network error"));
    });
    req.send(null);
}

$("#get7").click(function(ev) {
    ev.preventDefault();
    getURL("data/nonsense.txt", function(content, error) {
        if (error)
            console.log("Failed to fetch nonsense.txt: " + error);
        else
            console.log("nonsense.txt: " + content);
    });
});


$("#get8").click(function(ev) {
    ev.preventDefault();
    getURL("data/file2.txt", function(content, error) {
        if (error)
            console.log("Failed to fetch file2.txt: " + error);
        else
            console.log("file2.txt: " + content);
    });
});

//
// 347
//
tprint("### 347 Promises");

function get(url) {
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
}

$("#get9").click(function(ev) {
    ev.preventDefault();
    get("example/data.txt").then(function(text) {
        console.log("data.txt: " + text);
    },
    function(error) {
        console.log("Failed to fetch data.txt: " + error);
    });
});

function getJSON(url) {
    return get(url).then(JSON.parse);
}

$("#get10").click(function(ev) {
    ev.preventDefault();
    getJSON("example/fruit.json").then(function(fruits) {
        var out = "";
        out += "There are "+len(fruits).toString()+" fruits in the JSON document:\n";
        forEach(fruits, function(name, color) {
            out += ""+name.toString()+"\n";
        });
        console.log(out);
    });
});

$("#get11").click(function(ev) {
    ev.preventDefault();

    var div1 = document.getElementById("div1");
    function showMessage(msg) {
        var elt = document.createElement("div");
        elt.textContent = msg;
        return div1.appendChild(elt);
    }
    
    var loading = showMessage("Loading...");
    getJSON("example/bert.json").then(function(bert) {
        //console.log(":: Got bert.json");
        //console.log(":: bert.spouse: " + bert.spouse);
        return getJSON(bert.spouse);
    }).then(function(spouse) {
        //console.log(":: Got spouse");
        //console.log(":: spouse.name: " + spouse.name);
        return getJSON(spouse.mother);
    }).then(function(mother) {
        showMessage("The name is " + mother.name + ".");
    }).catch(function(error) {
        showMessage(String(error));
    }).then(function() {
        div1.removeChild(loading);
    });
});

//
// 350
//
tprint("### 350 Appreciating HTTP");

//
// 350
//
tprint("### 350 Security and HTTPS");

//
// Exercise 1
//
tprint("### Exercise 1 ");

function acceptMimeType(req, type) {
    req.overrideMimeType(type);
    req.setRequestHeader("Accept", type);
}    

function retrieveContent(url, mimeType) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    acceptMimeType(req, mimeType);
    req.send(null);
    if (req.status >= 400)
        return undefined;
    return req.responseText;
}


if(0)(function(){
    function showContentFor(mimeType) {
        var content;
        console.log("--- " + mimeType.toString() + " ---");
        content = retrieveContent("http://eloquentjavascript.net/author", mimeType);
        console.log(content);
    }
    
    showContentFor("text/plain");
    showContentFor("text/html");
    showContentFor("application/json");
    showContentFor("application/rainbows+unicorns");
    showContentFor("application/x-rainbows+unicorns");
})();

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

if(0)(function(){

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

