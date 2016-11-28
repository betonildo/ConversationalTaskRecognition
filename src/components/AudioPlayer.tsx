import * as React from "react";
import Queue from "../Queue";

interface IAudioPlayer {

}

export default class AudioPlayer extends React.Component<IAudioPlayer, {}> {

    private audioTagElement : HTMLAudioElement;
    private sourceTagElement : HTMLSourceElement;
    private blobQueue : Queue<Blob>;
    

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
            <div hidden>
                <audio controls id="audioTag"> 
                    <source id="voiceTag" type="audio/ogg" />
                </audio>
            </div>
        )
    }
}