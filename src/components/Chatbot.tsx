import * as React from "react";
import ChatConversation from "./ChatConversation";
import AudioPlayer from "./AudioPlayer";
import AudioRecorder from "./AudioRecorder";
import graph from "../GraphConfig";
import SpeechSynthesizer from "../SpeechSynthesizer";

// import specific CSS
require("./Chatbot.css");

interface IChatbot {
    conversations : Array<ChatConversation>
}

export default class Chatbot extends React.Component<IChatbot, {}> {

    private inputElement : HTMLInputElement;
    private synthesizer : SpeechSynthesizer;
    private conversationHistory : HTMLElement;
    private player : AudioPlayer;
    private recorder : AudioRecorder;
    private static Enter : string = "Enter";
    private static Me : string = "Me";

    state : {
        conversations : Array<ChatConversation>   
    }

    constructor(props:IChatbot) {
        super(props);
        this.state = {
            conversations : new Array<ChatConversation>()
        }

        this.synthesizer = new SpeechSynthesizer();
        this.synthesizer.setCallbackOnRequests(this.onAudioLoadedDonePlayIt.bind(this));
        graph.setOutputStream(this.printer.bind(this));        
    }

    componentDidMount() {
        this.printer(graph.getCurrentKnot().getRandomTemplate());
    }

    handleOnKeyDown(e:KeyboardEventInit) {

        if (e.key === Chatbot.Enter) {
            let who = Chatbot.Me;
            let what = this.inputElement.value;
            this.inputElement.value = "";
            this.pushToConversation(who, what);
            graph.tryNavigateUsing(what);
        }
    }

    onAudioLoadedDonePlayIt(error:any, blob:Blob) {
        if (!error) this.player.playAudio(blob);
        else console.error(error);
    }

    printer(input:string) {
        let who = "Watson";
        let what = input.toString();
        this.pushToConversation(who, what);
        this.synthesizer.transformTextToSpeech(input);       
    }

    pushToConversation(who:string,what:string) {
        this.setState((prevState : IChatbot, props : IChatbot) => {
            prevState.conversations.push(new ChatConversation({who:who, what:what}));
            return prevState;
        });   
    }

    render() {

        return (
            <div className="Chatbot">
                <div className="conversationHistory" ref={(div) => this.conversationHistory = div}>
                    <ul >
                        {
                            this.state.conversations.map((c, i) => {
                                return <ChatConversation key={i} who={c.props.who} what={c.props.what} />
                            })
                        }
                    </ul>
                </div>
                <div className="inputAndOutput">
                    <input ref={(input) => this.inputElement = input} type="text" id="inputElement" onKeyDown={this.handleOnKeyDown.bind(this)}/>
                    <AudioPlayer ref={(audioPlayerTag) => this.player = audioPlayerTag} currentAudioUrl=""/>
                    <AudioRecorder ref={(audioRecorderTag) => this.recorder = audioRecorderTag} />
                </div>
            </div>
        )
    }
}