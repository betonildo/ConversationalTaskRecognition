import * as React from "react";
import Queue from "../Queue";

interface IAudioPlayer {
    currentAudioUrl : string;
}

export default class AudioPlayer extends React.Component<IAudioPlayer, {}> {

    private audioTagElement : HTMLAudioElement;
    private sourceTagElement : HTMLSourceElement;
    private blobQueue : Queue<Blob>;
    private timer : NodeJS.Timer;
     

    constructor(arg:any) {
        super(arg);
        this.blobQueue = new Queue<Blob>();
    }

    public playAudio(blob:Blob) {
        this.blobQueue.enqueue(blob);

        if (this.isPaused()) {
            this.onAudioEnded();
        }
    }

    private onAudioEnded() {
        let currentAudio = this.blobQueue.dequeue();
        if (currentAudio) {
            this.sourceTagElement.src = URL.createObjectURL(currentAudio);
            this.audioTagElement.load();
            this.audioTagElement.play();
        }
        else {
            this.audioTagElement.pause();
        }
    }

    private isPaused() : boolean {
        console.log(this.audioTagElement.paused);
        return this.audioTagElement.paused;
    }

    private componentDidMount() {
        this.audioTagElement = document.getElementById("audioTag") as HTMLAudioElement;
        this.audioTagElement.onended = this.onAudioEnded.bind(this);
        this.sourceTagElement = this.audioTagElement.getElementsByTagName("source")[0];
    }

    render() {

        return (
            <div className="AudioPlayer">
                <audio controls id="audioTag"> 
                    <source id="voiceTag" src={this.props.currentAudioUrl} type="audio/ogg" />
                </audio>
            </div>
        )
    }
}