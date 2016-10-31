"use strict";
var Map = (function () {
    function Map() {
    }
    Map.prototype.contains = function (key) {
        return !!this[key];
    };
    Map.prototype.getKeys = function () {
        return Object.keys(this);
    };
    return Map;
}());
exports.Map = Map;
