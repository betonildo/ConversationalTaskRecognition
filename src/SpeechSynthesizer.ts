const voices = ["en-US_LisaVoice", "pt-BR_IsabelaVoice", "en-US_MichaelVoice", "en-US_AllisonVoice"];
const watsonApiUrl = "https://watson-api-explorer.mybluemix.net/text-to-speech/api/v1/synthesize?accept=audio%2Fogg%3Bcodecs%3Dopus";

import Requester from "./Requester";
import Queue from "./Queue";

export default class SpeechSynthesizer {

    private callback : (error:any, blob:Blob) => any;
    private textQueue : Queue<string>;
    private isRequesting : boolean;

    constructor() {
        this.textQueue = new Queue<string>();
        this.isRequesting = false;
        this.watchForSomeTextToPlay();
    }

    public setCallbackOnRequests( callback: (error:any, blob:Blob) => any) {
        this.callback = callback;
    }

    public transformTextToSpeech(text:string) {

        this.textQueue.enqueue(text);
    }

    watchForSomeTextToPlay() {
        setInterval( () => {
            if (!this.isRequesting) {
                this.makeSynthesizerRequest();
            }
        }, 250)
    }

    makeSynthesizerRequest() : any {

        if (!this.textQueue.isEmpty()) {
            this.isRequesting = true;
            let text = this.textQueue.dequeue();
            const finalUrl = watsonApiUrl + voices[0];
            Requester
                .postTextAndReceiveVoice(finalUrl, text)
                .then(res => {
                    return res.blob();
                })
                .then( (blob:Blob) => {
                    this.callback(null, blob);
                    if (!this.textQueue.isEmpty()) {
                        this.makeSynthesizerRequest();
                    }
                    else {
                        this.isRequesting = false;
                    }
                })
                .catch(reason => {
                    this.callback(reason, null)
                    this.isRequesting = false;
                });
        }
    }


}