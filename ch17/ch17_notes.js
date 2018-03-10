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
    


}); /* $(document).ready */

