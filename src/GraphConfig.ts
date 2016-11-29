import LinkedGraph from "./LinkedGraph";
import Knot from "./Knot";
import SpeechSynthesizer from "./SpeechSynthesizer";

let printer = console.log || null;
let todos = new Array<string>();


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

let markTodo = new Knot("MTWD");
let marksResponse = ["Ok, now say what's the description", "What is the description?"];
markTodo.addTemplates(marksResponse);
markTodo.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {

    let template = self.getRandomTemplate();
    printer(template);
});

let markTodoWithDescription = new Knot("MTWDNOW");
let markTodoWIthDescriptionTemplates = ["\"<TODO>\" marked properly", "I saved: \"<TODO>\""];
markTodoWithDescription.addTemplates(markTodoWIthDescriptionTemplates);
markTodoWithDescription.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {
    
    let template = self.getRandomTemplate();
    let response = template.replace("<TODO>", input);
    printer(response);

    todos.push(input);
    graph.goToRoot();
});

let listTodo = new Knot("LTWD");
let listTodoResponse = ["Your tasks are: <TODOS>"];
listTodo.addTemplates(listTodoResponse);
listTodo.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {

    let template = self.getRandomTemplate().toString();
    let todosList = "";
    let response = "You don't have any task to do!";

    if (todos.length > 0) {
        todos.forEach( (todo:string,index:number) => {
            if (index > 0){
                todosList += ", ";
            }
            todosList += todo;

            if (index == todos.length - 1){
                todosList += ".";
            }                
        });
        response = template.replace("<TODOS>", todosList);
        todosList += "";
    }
    
    printer(response);

    graph.goToRoot();
});

let clearTodos = new Knot("ClearAllTodos");
let clearTodosTemplates = ["All your todos cleared", "Now you have no todos", "tasks list cleared!"];
clearTodos.addTemplates(clearTodosTemplates);
clearTodos.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {

    let template = self.getRandomTemplate().toString();
    todos = new Array<string>();
    printer(template);
    graph.goToRoot();
});

let eraseOneTask = new Knot("eraseOneTask");
let eraseOneTaskTemplate = ["Task <TODO> was deleted!", "You don't have to do <TODO> anymore."];
eraseOneTask.addTemplates(eraseOneTaskTemplate);
eraseOneTask.onEntry( (input:string, self:Knot, graph:LinkedGraph, printer:Function) => {

    let template = self.getRandomTemplate().toString();
    
    let matchesIndex = input.match(/\w*(\d+)/);
    
    let response = "";

    try {
        
        let taskIndex = parseInt(matchesIndex[1]);

        if (taskIndex < todos.length) {
            let task = todos[taskIndex];
            response = template.replace("\"<TODO>\"", task)
            todos = todos.splice(taskIndex, 1);
        }
        else throw "Index don't matches!";

    }
    catch(e) {
        //console.
        response = "No task was removed!";
    }

    printer(response);
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
graph.tryLinkKnotsViaWith(rootKnot, "mark a task with description", 0.7, markTodo);
graph.tryLinkKnotsViaWith(rootKnot, "set a to do with description", 0.7, markTodo);
graph.tryLinkKnotsViaWith(rootKnot, "list my tasks", 0.7, listTodo);
graph.tryLinkKnotsViaWith(markTodo, "", 0, markTodoWithDescription);
graph.tryLinkKnotsViaWith(rootKnot, "clear my todos list", 0.7, clearTodos);
graph.tryLinkKnotsViaWith(rootKnot, "clear my tasks list", 0.7, clearTodos);
graph.tryLinkKnotsViaWith(rootKnot, "erase one task", 0.7, eraseOneTask);
graph.tryLinkKnotsViaWith(rootKnot, "remove a task", 0.7, eraseOneTask);

// TODO: set linking between nodes of the tasks
export default graph;