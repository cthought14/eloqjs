// Miscellaneous utilities.
"use strict";

function forEach(collection, fn) {
    for (var i = 0; i < collection.length; i++) {
        fn(collection[i], i);
    }
}

function clamp(value, min_, max_) {
    return value < min_ ? min_ : value > max_ ? max_ : value;
}

// decodeEntities.
// https://stackoverflow.com/questions/5796718/html-entity-decode
var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

////
////

