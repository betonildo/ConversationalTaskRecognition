import * as React from "react";
import * as ReactDOM from "react-dom";
import Chatbot from "./components/Chatbot";



ReactDOM.render(
    <Chatbot phrase1="Testando asdasd a similaridade de duas frases." phrase2="Testando similaridade de frases" />,
    document.getElementById("example")
);