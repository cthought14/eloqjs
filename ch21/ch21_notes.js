// Chapter 21 (Project: Skill-sharing Website)
"use strict";

/////
/////

var testutil = {};

function expect(observed, expected) {
    if (typeof expect.counter == 'undefined' ) 
        expect.counter = 0;

    // deepEqual_toString(a, b)
    // --- Modified version of deepEqual() from ch4.
    var deepEqual_toString = (function (a, b) {
        if (a !== null && typeof a == 'object' && 
            b !== null && typeof b == 'object')
            // => Need deep comparison.
        {
            for (var prop in a) {
                if (!(prop in b))
                    return false;
                if (!deepEqual_toString(a[prop], b[prop]))
                    return false;
            }
            return true;
        }
        if (a === null || b === null) 
            return a === null && b === null;
        return a.toString() == b.toString();
    });
        
    var out = "";
    var silent = ("silent" in testutil && !!testutil.silent);    
    if (!silent)
        out += (++expect.counter).toString() + ": ";
    
    var mismatch = false;
    if (typeof observed == 'undefined' && 
        typeof expected == 'undefined') 
    {
        out += "[OK] ";
    }
    else if (typeof observed != 'undefined' && 
            (deepEqual_toString(observed, expected)))
    {
        out += "[OK] ";
    }
    else {
        out += "[??] ";
        mismatch = true;
    }
    
    if (observed === null)
        out += "null";
    else if (typeof observed != 'undefined')
        out += observed.toString();
    else
        out += "undefined";
    if (mismatch) {
        out += " (Expected: ";
        if (expected === null)
            out += "null";
        else if (typeof expected != 'undefined') {
            out += expected.toString();
        }
        else
            out += "undefined";
        out += ")";
    }

    if (!mismatch && !silent)
        console.log(out);
    else if (!mismatch && silent)
        ;
    else
        console.warn(out);
}

function tprint(message) {
    var silent = ("silent" in testutil && !!testutil.silent);    
    if (!silent)
        console.log(message);
}

/////
/////


//
// 412
//
tprint("### Design");

//
// 413
//
tprint("### Long polling");

//
// 414
//
tprint("### HTTP interface");

// Example request to create a talk about idling.
var path;
path = "/talks/" + encodeURIComponent("How to Idle");
console.log("PUT "+path.toString()+" HTTP/1.1");

var newTalk;
newTalk = {
    "presenter": "Dana",
    "summary": "Standing still on a unicycle"};
var newTalkStr;
newTalkStr = JSON.stringify(newTalk);
var newTalkRequest;
newTalkRequest = "Content-Type: application/json\n\
Content-Length: __length__\n\
\n\
"+newTalkStr;

newTalkRequest = newTalkRequest.replace("__length__", newTalkStr.length);
console.log(newTalkRequest);

// Example request to comment on a talk.
console.log("");
path = "/talks/" + encodeURIComponent("Unituning") + "/comments";
console.log("PUT "+path.toString()+" HTTP/1.1");

var commentTalk;
commentTalk = {
    "author": "Alice",
    "message": "Will you talk about raising a cycle?"};
var commentTalkStr;
commentTalkStr = JSON.stringify(commentTalk);
var commentTalkRequest;
commentTalkRequest = "Content-Type: application/json\n\
Content-Length: "+commentTalkStr.length+"\n\
\n\
"+commentTalkStr;

console.log(commentTalkRequest);

// Long polling support.
console.log("");
console.log("Current server time: " + Date.now());

var thursday = new Date(2018, 3, 5).getTime(); // Thu 3 Apr 2018
console.log("Thu 3 Apr 2018: " + thursday);
console.log("");

path = "/talks?changesSince=" + thursday;
console.log("GET "+path.toString()+" HTTP/1.1");

var answer;
answer = {
    "serverTime": thursday + 1345,
    "talks": [
        {"title": "Unituning",
         "deleted": true}]};
var answerStr;
answerStr = JSON.stringify(answer);
var answerResponse;
answerResponse = "HTTP/1.1 200 OK\n\
Content-Type: application/json\n\
Content-Length: "+answerStr.length+"\n\
\n\
"+answerStr;
    
console.log(answerResponse);

//
// 416
//
tprint("### The server");

tprint("#### Routing");

// router.js

var talkRe = /^\/talks\/([^\/]+)$/;
expect(talkRe.test("/talks/aTalk"), true);
expect(talkRe.test("/talks"), false);
expect(talkRe.test("asdfghjkl;'"), false);

var match;
match = talkRe.exec("/talks/" + encodeURIComponent("How to Idle"));
console.log(match.slice(1).map(decodeURIComponent));

//
// 418
//
tprint("#### Serving files");
















    

