import * as React from "react";
import ChatConversation from "./ChatConversation";
import graph from "../GraphConfig";

interface IChatbot {
    conversations : Array<ChatConversation>
}

export default class Chatbot extends React.Component<IChatbot, {}> {

    private inputElement : HTMLInputElement;

    state : {
        conversations : Array<ChatConversation>   
    }

    constructor(props:IChatbot) {
        super(props);
        this.state = {
            conversations : new Array<ChatConversation>()
        }

        graph.setOutputStream(this.printer.bind(this));
    }

    handleOnKeyDown(e:KeyboardEventInit) {

        if (e.key === 'Enter') {
            let who = "Me";
            let what = this.inputElement.value;
            this.inputElement.value = "";

            let c = new ChatConversation({who:who, what:what});
            let self = this;
            this.setState((prevState : IChatbot, props : IChatbot) => {
                prevState.conversations.push(c);
                return prevState;
            });

            graph.tryNavigateUsing(what);
        }
    }

    printer(input:string) {
        let who = "Watson";
        let what = input.toString();

        let c = new ChatConversation({who:who, what:what});
        let self = this;
        this.setState((prevState : IChatbot, props : IChatbot) => {
            prevState.conversations.push(c);
            return prevState;
        });
    }

    componentDidMount() {
        this.inputElement = document.getElementById("inputElement") as HTMLInputElement;
    }

    render() {
        return (
            <div>
                <ul >
                    {
                        this.state.conversations.map((c, i) => {
                            return <ChatConversation key={i} who={c.props.who} what={c.props.what} />
                        })
                    }
                </ul>
                <input type="text" id="inputElement" onKeyDown={this.handleOnKeyDown.bind(this)}/>
            </div>
        )
    }
}