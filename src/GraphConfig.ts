import LinkedGraph from "./LinkedGraph";
import Knot from "./Knot";
import SpeechSynthesizer from "./SpeechSynthesizer";

let printer = console.log || null;

class String {

    public static formatHour(hours:number, minutes:number) : string {
        let minutesString = (minutes <= 9 ? "0" : "") + minutes.toString();
        let hoursString = (hours <= 9? "0" : "") + hours.toString();
        return hoursString + ":" + minutesString;   
    }
}

//////////////////////////////////////////////
///     SHOULD BE IN ANOTHER PLACE TO SETUP //
//////////////////////////////////////////////
let rootKnot = new Knot("HCIH?")
rootKnot.tryAddTemplate("How can i help?");
rootKnot.tryAddTemplate("What can i do for you?");
rootKnot.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {
    let currentTemplate = self.getRandomTemplate();
    printer(currentTemplate);
});

let timeResKnot = new Knot("WTIIT?");
timeResKnot.tryAddTemplate("It's <TIME>");
timeResKnot.tryAddTemplate("<TIME>");
timeResKnot.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {
    let template = self.getRandomTemplate();
    let date = new Date();
    let HHMM = String.formatHour(date.getHours(), date.getMinutes());
    let response = template.replace("<TIME>", HHMM);
    printer(response);
    graph.goToLastKnot();
});

let kindKnot = new Knot("WAYMF?");
let kindKnotTArray = ["I'm good stupid, machine remember? And you?", "good. And How are you?", "Awsome. And you?", "Umbelievable Awsome. And you?"];
kindKnot.addTemplates(kindKnotTArray);
kindKnot.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {
    let template = self.getRandomTemplate();
    printer(template);
});

let kindResponseKnot = new Knot("KRFUR");
let oksTemplates = ["Ok! Let's go to another command!", "Ok!","Ok! Let's do something intersting..."];
kindResponseKnot.addTemplates(oksTemplates);
kindResponseKnot.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {
    let template = self.getRandomTemplate();
    printer(template);
    graph.goToRoot();
});


//////////////////////////////////////////////


const graph = new LinkedGraph(rootKnot);
graph.tryLinkKnotsViaWith(rootKnot, "what time it it?", 0.6, timeResKnot);
graph.tryLinkKnotsViaWith(timeResKnot, "Return to beginning", 0.8, rootKnot);
graph.tryLinkKnotsViaWith(rootKnot, "How are you?", 0.7, kindKnot);
graph.tryLinkKnotsViaWith(rootKnot, "Are you good?", 0.7, kindKnot);
graph.tryLinkKnotsViaWith(kindKnot, "fine thanks", 0.7, kindResponseKnot);
graph.tryLinkKnotsViaWith(kindKnot, "i'm ok today, thanks!", 0.7, kindResponseKnot);
graph.tryLinkKnotsViaWith(kindKnot, "awsome, thanks!", 0.7, kindResponseKnot);
graph.tryLinkKnotsViaWith(kindKnot, "thank you for asking. im good", 0.7, kindResponseKnot);



export default graph;