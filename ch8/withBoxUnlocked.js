// withBoxUnlocked. Chapter 8, Exercise 2. The locked box.
"use strict";

var box = {
    locked: true,
    unlock: function() { this.locked = false; },
    lock: function() { this.locked = true; },
    _content: [],
    get content() {
        if (this.locked) throw new Error("Locked!");
        return this._content;
    },
};

function withBoxUnlocked(fn) {
    try {
        box.unlock();
        fn();
    } finally {
        box.lock();
    }
}

expect(box.locked, true);

withBoxUnlocked(function() {
    expect(box.content, []);
});

expect(box.locked, true);

try {
    withBoxUnlocked(function() {
        throw new Error("an error");
        expect(box.content, []);
    });
} catch(e) {}

expect(box.locked, true);
