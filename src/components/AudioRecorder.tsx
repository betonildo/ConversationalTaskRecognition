import * as React from "react";
import AudioWave from "../AudioWave";
import Queue from "../Queue";
import WaveExporter from "../WaveExporter";
import Vector2 from "../Vector2";


interface NavigatorUserMediaError {

}

interface IAudioRecorder {

}


export default class AudioRecorder extends React.Component<IAudioRecorder, {}> {

    private mediaRec: MediaStream;
    private audioTag: HTMLAudioElement;
    private sourceTag: HTMLSourceElement;
    private inputTextTag: HTMLInputElement;
    private audioContext: AudioContext;
    private microphone: MediaStreamAudioSourceNode;
    private filter: BiquadFilterNode;
    private recorder: ScriptProcessorNode;
    private audioBufferQueue = new Queue<AudioBuffer>();
    private currentFloatArrayData: Float32Array;
    private previousFloatArrayData: Float32Array;
    public static MaxRecordTime = 10;
    private audioWave = new AudioWave("AudioWaves");
    private audioRawIndex = 0;
    private audioRaw = new Float32Array(2048000);
    private recordingTime = 0;
    private bufferSize = 1024;
    private numberOfChannels = 1;
    private frameCount = 0;

    constructor(args: any) {

        super(args);
        navigator.getUserMedia({ audio: true }, this.successGetUserMediaCallback.bind(this), this.errorGetUserMediaCallback.bind(this));
    }

    private successGetUserMediaCallback(stream: MediaStream): NavigatorUserMediaSuccessCallback {
        this.mediaRec = stream;
        this.audioContext = new AudioContext();

        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.filter = this.audioContext.createBiquadFilter();

        // microphone -> filter -> destination.
        //this.microphone.connect(this.filter);
        //this.filter.connect(this.audioContext.destination);
        this.frameCount = this.audioContext.sampleRate * this.numberOfChannels;
        this.recorder = this.audioContext.createScriptProcessor(this.bufferSize, this.numberOfChannels, this.numberOfChannels);
        this.recorder.onaudioprocess = this.audioProcessing.bind(this);
        this.microphone.connect(this.recorder);
        this.recorder.connect(this.audioContext.destination);

        this.startTimeWatcher();
        return null;
    }

    private errorGetUserMediaCallback(mediaError: NavigatorUserMediaError): NavigatorUserMediaErrorCallback {
        console.error(mediaError);
        this.mediaRec = null;
        return null;
    }

    private startTimeWatcher() {
        this.recordingTime = 0;
        setInterval(() => {
            this.recordingTime++;
            if (this.recordingTime >= AudioRecorder.MaxRecordTime) {
                this.recordingTime = 0;
            }
        }, 1000);
    }

    private audioProcessing(event: AudioProcessingEvent) {

        if (this.hasMediaStream()) {

            this.previousFloatArrayData = this.currentFloatArrayData;
            this.currentFloatArrayData = event.inputBuffer.getChannelData(0);

            if (this.previousFloatArrayData) {
                this.audioWave.bufferToShow(this.currentFloatArrayData);
            }

            this.setMaxRecordTimeFrame();
        }
    }

    private hasMediaStream() {
        return !!this.mediaRec;
    }

    private setMaxRecordTimeFrame() {
        if (this.recordingTime < AudioRecorder.MaxRecordTime) {
            for (let i = 0; i < this.currentFloatArrayData.length; i++) {
                this.audioRaw[this.audioRawIndex] = this.currentFloatArrayData[i];
                this.audioRawIndex++;
            }
        }
        else {
            this.audioRaw = this.audioRaw.slice(this.currentFloatArrayData.length, this.audioRaw.length);
            for (let i = this.audioRawIndex - this.currentFloatArrayData.length; i < this.currentFloatArrayData.length; i++) {
                this.audioRaw[i] = this.currentFloatArrayData[i];
            }
        }
    }

    render() {
        return (
            <div hidden>
                <div>
                    <audio ref={(audioTag) => this.audioTag = audioTag} controls>
                        <source ref={(sourceTag) => this.sourceTag = sourceTag} />
                    </audio>
                </div>
            </div>
        )
    }
}