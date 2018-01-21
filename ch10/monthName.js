// monthName. Chapter 10, Exercise 1. Month names.
"use strict";

// monthNames
// --------------
// nameOf(number) : string
// numberOf(month) : int

var monthNames = function() {
    var nameToNumber = {
        "Sunday": 0,
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
    };

    var numberToName = {};

    for (name in nameToNumber) {
        var number = nameToNumber[name];
        numberToName[number] = name;
    }

    return {
        nameOf: function(monthNumber) {
            return numberToName[monthNumber];
        },
        
        numberOf: function(month) {
            return nameToNumber[month];
        },
    };
}();

expect(monthNames.nameOf(1), "Monday");
expect(monthNames.nameOf(6), "Saturday");
expect(monthNames.numberOf("Monday"), 1);
expect(monthNames.numberOf("Saturday"), 6);
