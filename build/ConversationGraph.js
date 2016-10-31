"use strict";
var Jaccard_1 = require("./Jaccard");
var ConversationGraph = (function () {
    function ConversationGraph() {
        this.jaccar = new Jaccard_1.Jaccard(3);
        this.graph = {};
    }
    ConversationGraph.prototype.setEntryPoint = function (root) {
        this.graph[root] = {
            current: root,
            dest: "",
            command: null
        };
        this.root = root;
    };
    ConversationGraph.prototype.getRootNode = function () {
        return this.graph[this.root];
    };
    ConversationGraph.prototype.setPossiblePath = function (origin, dest, command) {
        // this is a linked list, but to be a graph, we must consider the destination a array of possibilities
        this.graph[origin] = {
            current: origin,
            dest: dest,
            command: command
        };
    };
    ConversationGraph.prototype.getPossibleDestinationNodes = function (possibleDestination) {
        var _this = this;
        // TODO: Filter only possibles nodes to not include any of the previous ones 
        var possibleKeys = Object.keys(this.graph).map(function (gkey) {
            var node = _this.graph[gkey];
            return {
                current: gkey,
                dest: node.dest,
                similarity: _this.jaccar.similarity(node.dest.toLowerCase(), possibleDestination.toLowerCase())
            };
        });
        possibleKeys.sort(function (kl, kr) {
            return kr.similarity - kl.similarity;
        });
        return possibleKeys;
    };
    ConversationGraph.prototype.getNode = function (key) {
        return this.graph[key];
    };
    ConversationGraph.SIMILARITY_THRESHOLD = 0.6;
    return ConversationGraph;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConversationGraph;
