import * as React from "react";
import ChatConversation from "./ChatConversation";
import AudioPlayer from "./AudioPlayer";
import AudioRecorder from "./AudioRecorder";
import graph from "../GraphConfig";
import SpeechSynthesizer from "../SpeechSynthesizer";

//TODO: improve conversation history, because it's using a lot of memory. JSArrayData and HTML li list is longer than would be.

// import specific CSS
require("./Chatbot.css");

interface IChatbot {
    conversations : Array<ChatConversation>
}

export default class Chatbot extends React.Component<IChatbot, {}> {

    private inputElement : HTMLInputElement;
    private synthesizer : SpeechSynthesizer;
    private conversationContent : HTMLElement;
    private conversationList : HTMLUListElement;

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
        graph.addOutputStreamForUserInputs(this.getUserInput.bind(this));
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
    
    getUserInput(input:string) {
        console.log(input);
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
            // Work around to scrol to the last pushed input.
            // none of other events worked properly.
            // after 10 ms, that is a lot of time to insert the last entry, than it scrolls down.
            // the problem is that a simple call doesn't match the last child inserted and the
            // scroll doesn't show the last entry, because it will be inserted on DOM after last element in here
            
            return prevState;
        });

        setTimeout(() => this.scrollConversationToTheBottom(), 10);
    }

    scrollConversationToTheBottom() {
        let lastConversationChild = this.conversationList.lastElementChild as HTMLElement;

        if (lastConversationChild) {
           this.conversationContent.scrollTop = lastConversationChild.offsetTop; 
        }
    }

    render() {

        return (
            <div className="Container">
                <header>
                        Watson Conversational Task Recognition
                </header>

                <div className="Content">

                    <div className="ContentList" ref={(div) => this.conversationContent = div}>
                        <div>
                            <ul ref={(ul) => this.conversationList = ul} >
                                {this.state.conversations.map((c, i) => {
                                    return <ChatConversation key={i} who={c.props.who} what={c.props.what} />
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="ContentInput"> 
                        <input  ref={(input) => this.inputElement = input} 
                                type="text" 
                                id="inputElement" 
                                onKeyDown={this.handleOnKeyDown.bind(this)}
                                placeholder="Enter some command to Watson..."/>
                    </div>                                      
                </div>
                <AudioPlayer ref={(audioPlayerTag) => this.player = audioPlayerTag} />
                <AudioRecorder ref={(audioRecorderTag) => this.recorder = audioRecorderTag} />

                <canvas name="AudioWaves">

                </canvas>
            </div>
        )
    }
}