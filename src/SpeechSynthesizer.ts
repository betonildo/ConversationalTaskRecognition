const voices = ["en-US_LisaVoice", "pt-BR_IsabelaVoice", "en-US_MichaelVoice", "en-US_AllisonVoice"];
const watsonApiUrl = "https://watson-api-explorer.mybluemix.net/text-to-speech/api/v1/synthesize?accept=audio%2Fogg%3Bcodecs%3Dopus";

import Requester from "./Requester";

export default class SpeechSynthesizer {

    public playText(text:string, callback : (error:any, blob:Blob) => void) {
        console.log('asduhasiudh');
        const finalUrl = watsonApiUrl + voices[0];
        Requester
            .postTextAndReceiveVoice(finalUrl, text)
            .then(res => {
                return res.blob();
            })
            .then(bytesArray => {
                callback(null, bytesArray);
            })
            .catch(error => {
                callback(error, null);
            });
    }

    public isPlaying() : boolean {

        return false;
    }
}