import * as React from "react";
import Jaccard from "../Jaccard";

let j = new Jaccard(1);

interface IChatbot {
    phrase1 : string;
    phrase2 : string;
}

export default class Chatbot extends React.Component<IChatbot, {}> {

    render() {
        return (
            <div>
                <div>Similarity: {j.similarity(this.props.phrase1, this.props.phrase2)}</div>
                <div>Phrase1: {this.props.phrase1}</div>
                <div>Phrase2: {this.props.phrase2}</div>
                <input type="text" id="inputElement" />
            </div>
        )
    }
}