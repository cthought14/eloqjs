// doubleQuote. Chapter 9, Exercise 2. Quoting style.
"use strict";

var re1 = /(^|[ ,.])'(.*?)'($|[ ,.])/g;

console.log("-----\n");
var text0 = "'Hello world, Don't do this,' she said. 'Goodbye,' he said.";
var replaced0 = text0.replace(re1, "$1\"$2\"$3");
console.log(replaced0);

// If the text contains newlines, it seems that each line needs to be processed separately.

var text2 = 
"'That's just where you're mistaken, professor,' Ned replied. 'The common man may still believe in fabulous comets crossing outer space, or in prehistoric monsters living at the earth's core, but astronomers and geologists don't swallow such fairy tales. It's the same with whalers. I've chased plenty of cetaceans, I've harpooned a good number, I've killed several. But no matter how powerful and well armed they were, neither their tails or their tusks could puncture the sheet–iron plates of a steamer.'\n"+
"\n"+
"'Even so, Ned, people mention vessels that narwhale tusks have run clean through.'\n"+
"\n"+
"'Wooden ships maybe,' the Canadian replied. 'But I've never seen the like. So till I have proof to the contrary, I'll deny that baleen whales, sperm whales, or unicorns can do any such thing.'\n"+
"\n"+
"'Listen to me, Ned—'\n"+
"\n"+
"'No, no, professor. I'll go along with anything you want except that. Some gigantic devilfish maybe . . . ?'\n"+
"";

var replaced2 = "";
text2.split("\n").forEach(function(line) { 
    replaced2 += line.replace(re1, "$1\"$2\"$3") + "\n";
});
console.log("-----\n");
console.log(replaced2);
