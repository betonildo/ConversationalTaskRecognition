/// <reference path="../typings/whatwg-streams/whatwg-streams.d.ts" />
/// <reference path="../typings/whatwg-fetch/whatwg-fetch.d.ts" />
import fetch from "./fetch";

export default class Requester {

    static request(options:RequestInfo, init?:RequestInit) : Promise<Response> {

        if (init) return fetch(options, init);
        else return fetch(options);
    }

    public static postTextAndReceiveVoice(url:string, text:string) : Promise<Response> {

        return this.request(url, {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "*/*"
            },
            body : JSON.stringify({text:text})
        });
    }
}