import * as React from "react";
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
    private inputTextTag : HTMLInputElement;
    private recording: boolean;
    private audioContext: AudioContext;
    private microphone: MediaStreamAudioSourceNode;
    private filter: BiquadFilterNode;
    private recorder: ScriptProcessorNode;
    private bufferSize = 2048;
    private audioBufferQueue: Queue<AudioBuffer>;
    private audioRaw : Float32Array;
    private audioRawIndex = 0;
    private currentFloatArrayData : Float32Array;
    private previousFloatArrayData : Float32Array;
    private interval : NodeJS.Timer;
    private listening = false;
    private recordingTime = 0;
    private static MaxRecordTime = 30;
    private static PitchThreshold = 1e-10;
    private canRearFromMic : boolean;

    private numberOfChannels = 1;
    private frameCount = 0;

    constructor(args: any) {

        super(args);
        window.URL = window.URL || window.webkitURL;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia({ audio: true }, this.successGetUserMediaCallback.bind(this), this.errorGetUserMediaCallback.bind(this));
        this.audioBufferQueue = new Queue<AudioBuffer>();
        this.audioRaw = new Float32Array(10000000);
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
        
        this.listening = true;
        this.startTimeWatcher();
        return null;
    }

    private errorGetUserMediaCallback(mediaError: NavigatorUserMediaError): NavigatorUserMediaErrorCallback {
        console.log(mediaError);
        this.mediaRec = null;
        return null;
    }

    private audioProcessing(event: AudioProcessingEvent) {

        if (this.hasMediaStream()) {

            this.previousFloatArrayData = this.currentFloatArrayData;
            this.currentFloatArrayData = event.inputBuffer.getChannelData(0);
            
            if (this.previousFloatArrayData){
                let pitch = this.detectAmountOfPitch(this.previousFloatArrayData, this.currentFloatArrayData);
                if (!this.isRecording() && pitch.lower < pitch.higher) {
                    this.startRecording();
                }

                if (this.isRecording() && pitch.lower > pitch.higher || this.recordingTime >= AudioRecorder.MaxRecordTime) {
                    this.stopRecording();
                }
            }
            
            this.setMaxRecordTimeFrame();
        }
    }

    private startTimeWatcher() {
        this.recordingTime = 0;
        this.interval = setInterval(() => {
            this.recordingTime++;
            console.log(this.recordingTime);
            if (this.recordingTime > AudioRecorder.MaxRecordTime)
                this.recordingTime = 0;
        }, 1000);
    }

    private setMaxRecordTimeFrame() {
        if (this.recordingTime < AudioRecorder.MaxRecordTime) {
            for(let i = 0; i < this.currentFloatArrayData.length; i++) {
                this.audioRaw[this.audioRawIndex] = this.currentFloatArrayData[i];
                this.audioRawIndex++;
            }            
        }
        else {
            this.audioRaw = this.audioRaw.slice(this.currentFloatArrayData.length, this.audioRaw.length);
            for(let i = this.audioRawIndex - 1; i < this.currentFloatArrayData.length; i++) {
                this.audioRaw[i] = this.currentFloatArrayData[i];
            }
        }

        //console.log(this.audioRawIndex);
    }

    private detectAmountOfPitch(previousChannelData:Float32Array, currentChannelData:Float32Array) : {lower:number,higher:number,V:Vector2,Vminus:Vector2,Vplus:Vector2} {
        
        let V = Vector2.getVFloatArray(previousChannelData);
        let Vminus = Vector2.getVminusFloatArray(currentChannelData);
        let Vplus = Vector2.getVplusFloatArray(currentChannelData);        
        let lower = Vector2.dot(V, Vminus);
        let higher = Vector2.dot(V, Vplus);

        return {lower, higher, V, Vminus, Vplus};
    }

    private startRecording() {
        this.recording = true;
        console.log('Start Recording!!!');
    }

    private stopRecording() {
        this.recording = false;
        console.log('Stop Recording!!!');

        let audioBufferC = this.audioContext.createBuffer(1, this.audioRawIndex, this.audioContext.sampleRate);
        audioBufferC.copyToChannel(this.audioRaw, 0, 0);

        console.log(audioBufferC);
        this.playAudioBuffer(audioBufferC);

    }    

    private playAudioBuffer(audioBuffer:AudioBuffer) {
        let audioBufferSource = this.audioContext.createBufferSource();
        audioBufferSource.buffer = audioBuffer;
        audioBufferSource.onended = this.onAudioBufferSourceEnded.bind(this);
        audioBufferSource.connect(this.audioContext.destination);        
        audioBufferSource.start();
    }

    private onAudioBufferSourceEnded(ev: Event) {
        if (!this.audioBufferQueue.isEmpty()) {
            let audioBuffer = this.audioBufferQueue.dequeue();
            console.log(audioBuffer);
            this.playAudioBuffer(audioBuffer);
        }
    }

    private isRecording() {
        return this.recording;
    }

    private hasMediaStream() {
        return !!this.mediaRec;
    }

    render() {
        return (
            <div>
                <audio ref={(audioTag) => this.audioTag = audioTag} controls>
                    <source ref={(sourceTag) => this.sourceTag = sourceTag} />
                </audio>
                <input type="button" onClick={this.startRecording.bind(this)} value="Start Recording" />
                <input type="button" onClick={this.stopRecording.bind(this)} value="Stop Recording" />
            </div>
        )
    }
}