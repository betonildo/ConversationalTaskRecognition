import * as React from "react";
import * as ReactDOM from "react-dom";
import Chatbot from "./components/Chatbot";

ReactDOM.render(
    <Chatbot conversations={[]}/>,
    document.getElementById("Watson")
);