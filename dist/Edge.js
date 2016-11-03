"use strict";
var Edge = (function () {
    function Edge() {
    }
    Edge.prototype.equals = function (other) {
        return this.origin.equals(other.origin) &&
            this.via === other.via &&
            this.destiny.equals(other.destiny);
    };
    Edge.prototype.cloneVia = function (input) {
        var edge = new Edge();
        edge.origin = this.origin;
        edge.via = input;
        edge.destiny = this.destiny;
        edge.similarityThreshold = this.similarityThreshold;
        edge.command = this.command;
        return edge;
    };
    return Edge;
}());
exports.__esModule = true;
exports["default"] = Edge;
//# sourceMappingURL=Edge.js.map