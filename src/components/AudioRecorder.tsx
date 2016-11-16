import * as React from "react";

interface IAudioRecorder {

} 


export default class AudioRecorder extends React.Component<IAudioRecorder,{}> {

    private mediaRec : MediaStream;

    constructor(args:any) {
        super(args);

        
    }


    render() {
        return (
            <div>
                This is the audio recorder.
            </div>
        )
    }
}