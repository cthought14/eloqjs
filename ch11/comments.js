// comments. Chapter 11, Exercise 3. Comments.
"use strict";

run; // From ch11_notes.js

tprint("## comments.js");
tprint("### Exercise 3. Comments.");

// 1:
expect(skipSpace("   Hi"), "Hi");
expect(skipSpace("   Hi "), "Hi ");
expect(skipSpace("   Hi # This is a comment."), "Hi ");
    
ret = run(" \
    do( \
        print(314159), # PI, 3.14159 \n\
        print(980665), # g, 9.80665 m/s^2 \n\
        print(602214)  # Avogadro's number, 6.02214e+23 1/mol \n\
    ) \
");
