"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Jaccard_1 = require("../Jaccard");
var j = new Jaccard_1["default"](1);
var Chatbot = (function (_super) {
    __extends(Chatbot, _super);
    function Chatbot() {
        _super.apply(this, arguments);
    }
    Chatbot.prototype.render = function () {
        return (React.createElement("div", null, 
            React.createElement("div", null, 
                "Similarity: ", 
                j.similarity(this.props.phrase1, this.props.phrase2)), 
            React.createElement("div", null, 
                "Phrase1: ", 
                this.props.phrase1), 
            React.createElement("div", null, 
                "Phrase2: ", 
                this.props.phrase2), 
            React.createElement("input", {type: "text", id: "inputElement"})));
    };
    return Chatbot;
}(React.Component));
exports.__esModule = true;
exports["default"] = Chatbot;
//# sourceMappingURL=Chatbot.js.map