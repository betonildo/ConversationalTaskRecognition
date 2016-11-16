/// <reference path="../typings/whatwg-streams/whatwg-streams.d.ts" />
/// <reference path="../typings/whatwg-fetch/whatwg-fetch.d.ts" />

export default class Requester {

    public static postTextAndReceiveVoice(url:string, text:string) : Promise<Response> {

        let textJson = JSON.stringify({text:text});
        return fetch(url, {
            method : "POST",
            headers : new Headers({
                "Content-Type" : "application/json",
                "Accept" : "audio/ogg"
            }),
            body : textJson
        });
    }
}