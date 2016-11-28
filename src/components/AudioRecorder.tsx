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
    private recording: boolean;
    private audioContext: AudioContext;
    private microphone: MediaStreamAudioSourceNode;
    private filter: BiquadFilterNode;
    private recorder: ScriptProcessorNode;
    private bufferSize = 2048;
    private audioBufferQueue: Queue<AudioBuffer>;
    private audioRaw: Float32Array;
    private audioRawIndex = 0;
    private currentFloatArrayData: Float32Array;
    private previousFloatArrayData: Float32Array;
    private interval: number;
    private listening = false;
    private recordingTime = 0;
    private static MaxRecordTime = 30;
    private static PitchThreshold = 1e-10;
    private canRearFromMic: boolean;
    private static THRESHOLD = -0.00001;

    private audioWave : AudioWave = new AudioWave("AudioWaves");

    private numberOfChannels = 1;
    private frameCount = 0;

    constructor(args: any) {

        super(args);
        window.URL = window.URL;
        navigator.getUserMedia = navigator.getUserMedia;
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

            if (this.previousFloatArrayData) {
                //let longerRawAudio = this.getLongerValidRawAudioChunk(this.currentFloatArrayData);             
                this.audioWave.bufferToShow(this.currentFloatArrayData);
            }

            this.setMaxRecordTimeFrame();
        }
    }

    private getLongerValidRawAudioChunk(audioRaw: Float32Array): Float32Array {

        let searchIndex = 0;
        let longerValidRawAudioChunk = new Array<number>();
        let currentValidRawAudioChunk = new Array<number>();

        let isSearching = true;
        while (isSearching) {

            searchIndex = this.getNextValidChunk(audioRaw, searchIndex, currentValidRawAudioChunk);

            if (currentValidRawAudioChunk.length > longerValidRawAudioChunk.length){
                longerValidRawAudioChunk = currentValidRawAudioChunk.slice();
            }   

            if (searchIndex >= audioRaw.length) isSearching = false;
        }

        return new Float32Array(longerValidRawAudioChunk);
    }

    private getNextValidChunk(audioRaw: Float32Array, start: number, outputValidRawAudioChunk: Array<number>): number {

        let i = start;

        while (i < audioRaw.length && audioRaw[i] < AudioRecorder.THRESHOLD)
            i++;

        let j = i;
        while (j < audioRaw.length && audioRaw[j] > AudioRecorder.THRESHOLD) {
            outputValidRawAudioChunk.push(audioRaw[j]);
        }

        return j;
    }

    private startTimeWatcher() {
        this.recordingTime = 0;
        this.interval = setInterval(() => {
            this.recordingTime++;
            if (this.recordingTime >= AudioRecorder.MaxRecordTime)
                this.recordingTime = 0;
        }, 1000);
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
            for (let i = this.audioRawIndex - 1; i < this.currentFloatArrayData.length; i++) {
                this.audioRaw[i] = this.currentFloatArrayData[i];
            }
        }
    }

    private detectAmountOfPitch(previousChannelData: Float32Array, currentChannelData: Float32Array): { lower: number, higher: number, V: Vector2, Vminus: Vector2, Vplus: Vector2 } {

        let V = Vector2.getVFloatArray(previousChannelData);
        let Vminus = Vector2.getVminusFloatArray(currentChannelData);
        let Vplus = Vector2.getVplusFloatArray(currentChannelData);
        let lower = Vector2.dot(V, Vminus);
        let higher = Vector2.dot(V, Vplus);

        return { lower, higher, V, Vminus, Vplus };
    }

    private playAudioBuffer(audioBuffer: AudioBuffer) {
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

    private hasMediaStream() {
        return !!this.mediaRec;
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