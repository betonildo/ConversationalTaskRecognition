"use strict";
var Set = (function () {
    function Set() {
        this.hash = new Object();
    }
    Set.prototype.contains = function (key) {
        return !!this.hash[key];
    };
    Set.prototype.addAll = function (keys) {
        keys.forEach(this.add.bind(this));
    };
    Set.prototype.add = function (key) {
        this.hash[key] = true;
    };
    Set.prototype.remove = function (key) {
        delete this.hash[key];
    };
    Set.prototype.forEach = function (runCallback) {
        for (var _i = 0, _a = Object.keys(this.hash); _i < _a.length; _i++) {
            var key = _a[_i];
            runCallback(key);
        }
    };
    Set.prototype.size = function () {
        return Object.keys(this.hash).length;
    };
    return Set;
}());
exports.Set = Set;
