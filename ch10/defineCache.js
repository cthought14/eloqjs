// _defineCache() - Function-based replacement for the 
// defineCache object used in Chapter 10's AMD-style module 
// loading implementation.
"use strict";

///
///

//var defineCache = Object.create(null);
function _defineCache(key, value) {
    if (typeof _defineCache.data == "undefined")
        _defineCache.data = Object.create(null);
    if (key) {
        _defineCache.data[key] = value;
    }
    return _defineCache.data;
}

/*
    if (name in defineCache)
        return defineCache[name];
*/

_defineCache("name1", "value1");
expect("name1" in _defineCache(), true);
expect("name2" in _defineCache(), false);
expect(_defineCache().name1, "value1");

/*
    defineCache[name] = module;
*/

_defineCache("name2", "value2");
expect(_defineCache().name2, "value2");

///
///

delete _defineCache().name1;
delete _defineCache().name2;
