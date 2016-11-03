"use strict";
var Knot_1 = require("./Knot");
var ConversationGraph = (function () {
    function ConversationGraph(rootName) {
        this.graph = {};
        this.currentKnot = new Knot_1["default"](rootName);
    }
    /**
     * @description Set new knot to this graph
     */
    ConversationGraph.prototype.setKnot = function (name) {
        var knot = new Knot_1["default"](name);
        this.graph[name] = knot;
    };
    // set obligate next
    /**
     * @description Link navigation from node origin to destiny via some command.
     * @return whether or not link was successfully added.
     */
    ConversationGraph.prototype.link = function (origin, via, destiny) {
        var linkKnot = this.graph[origin];
        return linkKnot.tryAddChild(via, this.graph[destiny]);
    };
    /**
     * @description Try to navigate to new knot on the graph
     */
    ConversationGraph.prototype.navigate = function (input) {
        var nextChild = this.currentKnot.getChildrenSortedVia(input)[0];
        // add new link from current knot to the most similar if 
        // similarity pass the new link to threshold
        // train...
        if (nextChild.getCurrentSimilarity() >= ConversationGraph.ADDITION_SIMILARITY_THRESHOLD) {
            this.currentKnot.tryAddChild(input, nextChild);
        }
        var realNextChild = nextChild.getCurrentSimilarity() < ConversationGraph.SIMILARITY_THRESHOLD ? this.currentKnot : nextChild;
        this.currentKnot = realNextChild;
        return realNextChild;
    };
    /**
     * @description Get current knot on navigation
     */
    ConversationGraph.prototype.getCurrentKnot = function () {
        return this.currentKnot;
    };
    ConversationGraph.SIMILARITY_THRESHOLD = 0.6;
    ConversationGraph.ADDITION_SIMILARITY_THRESHOLD = 0.85;
    return ConversationGraph;
}());
exports.__esModule = true;
exports["default"] = ConversationGraph;
//# sourceMappingURL=ConversationGraph.js.map