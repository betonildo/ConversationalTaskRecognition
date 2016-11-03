"use strict";
var Jaccard_1 = require("./Jaccard");
var jaccard = new Jaccard_1["default"](1);
var Knot = (function () {
    function Knot(name) {
        this.edges = {};
        this.name = name;
    }
    /**
     * @description Try add child via some command
     * @param via
     * @param child
     * @return boolean returns if child was added or not
     */
    Knot.prototype.tryAddChild = function (e) {
        var child = this.edges[e.via];
        // add child
        if (child === null || child === undefined) {
            this.edges[e.via] = e;
        }
        // do nothing
        return false;
    };
    /**
     * @description Get children sorted by similarity with input
     * @param input
     * @return Knot array sorted
     */
    Knot.prototype.getChildrenSortedVia = function (input) {
        var self = this;
        var children = Object.keys(this.edges).map(function (edgeKey) {
            var edge = self.edges[edgeKey];
            edge.destiny.currentSimilarity = jaccard.similarity(input, edge.via);
            return edge;
        })
            .filter(function (edge) {
            return edge.similarityThreshold >= edge.destiny.getCurrentSimilarity();
        });
        children.sort(function (a, b) {
            return b.destiny.currentSimilarity - a.destiny.currentSimilarity;
        });
        return children;
    };
    /**
     * @description Get currentSimilarity
     */
    Knot.prototype.getCurrentSimilarity = function () {
        return this.currentSimilarity;
    };
    Knot.prototype.equals = function (other) {
        return this.name === other.name;
    };
    return Knot;
}());
exports.__esModule = true;
exports["default"] = Knot;
//# sourceMappingURL=Knot.js.map