import * as React from "react";

export interface IConversation {
    who:string;
    what:string;
}

export default class ChatConversation extends React.Component<IConversation, {}> {

    render() {

        return (
            <li>
                <b>{this.props.who}</b> says: <span>{this.props.what}</span>
            </li>
        )
    }
}
