"use strict";
var LinkedGraph = (function () {
    function LinkedGraph(root) {
        this.knots = {};
        this.edges = {};
        this.knots[root.name] = root;
        this.currentKnot = root;
    }
    /**
     * @description Set new knot to this knots
     */
    LinkedGraph.prototype.setKnot = function (knot) {
        this.knots[knot.name] = knot;
    };
    LinkedGraph.prototype.tryLinkKnotsUsing = function (e) {
        try {
            // set knot to the knots if it not exists
            var originKnot = this.knots[e.origin.name] = this.knots[e.origin.name] || e.origin;
            var destinyKnot = this.knots[e.destiny.name] = this.knots[e.destiny.name] || e.destiny;
            var edge = this.edges[e.via];
            if (edge === null || edge === undefined) {
                // success
                this.edges[e.via] = e;
                return originKnot.tryAddChild(e);
            }
            else
                throw new Error("Knots already linked via this edge");
        }
        catch (e) {
            // knot not found or already linked
            console.error(e.message);
        }
        return false;
    };
    /**
     * @description Try to navigate to new knot on the knots
     */
    LinkedGraph.prototype.tryNavigateUsing = function (input) {
        // let nextChild = this.currentKnot.getChildrenSortedVia(input)[0];
        // // add new link from current knot to the most similar if 
        // // similarity pass the new link to threshold
        // // train...
        // if (nextChild.getCurrentSimilarity() >= LinkedGraph.ADDITION_SIMILARITY_THRESHOLD) {
        //     this.currentKnot.tryAddChild(input, nextChild);
        // }
        // let realNextChild = nextChild.getCurrentSimilarity() < LinkedGraph.SIMILARITY_THRESHOLD ? this.currentKnot : nextChild;
        // this.currentKnot = realNextChild;
        // return realNextChild;
        try {
            var possibleTransitionEdges = this.currentKnot.getChildrenSortedVia(input);
            if (possibleTransitionEdges.length > 0) {
                var futureEdge = possibleTransitionEdges[0]; // most significant
                this.currentKnot = futureEdge.destiny;
                if (futureEdge.command) {
                    futureEdge.command(input);
                }
                if (futureEdge.destiny.getCurrentSimilarity() > LinkedGraph.ADDITION_SIMILARITY_THRESHOLD) {
                    var edge = futureEdge.cloneVia(input);
                    this.tryLinkKnotsUsing(edge);
                }
                return true;
            }
        }
        catch (e) {
        }
        return false;
    };
    /**
     * @description Get current knot on navigation
     */
    LinkedGraph.prototype.getCurrentKnot = function () {
        return this.currentKnot;
    };
    LinkedGraph.SIMILARITY_THRESHOLD = 0.6;
    LinkedGraph.ADDITION_SIMILARITY_THRESHOLD = 0.85;
    return LinkedGraph;
}());
exports.__esModule = true;
exports["default"] = LinkedGraph;
//# sourceMappingURL=LinkedGraph.js.map