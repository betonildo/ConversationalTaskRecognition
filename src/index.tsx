import * as React from "react";
import * as ReactDOM from "react-dom";
import Chatbot from "./components/Chatbot";
import ChatConversation from "./components/ChatConversation";

ReactDOM.render(
    <Chatbot conversations={[]}/>,
    document.getElementById("example")
);