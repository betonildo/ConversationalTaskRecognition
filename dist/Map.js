"use strict";
var Map = (function () {
    function Map() {
        this.obj = {};
    }
    Map.prototype.contains = function (key) {
        return !!this.obj[key];
    };
    Map.prototype.setValue = function (key, value) {
        this.obj[key] = value;
    };
    Map.prototype.getValue = function (key) {
        return this.obj[key];
    };
    Map.prototype.getKeys = function () {
        return Object.keys(this.obj);
    };
    return Map;
}());
exports.__esModule = true;
exports["default"] = Map;
//# sourceMappingURL=Map.js.map