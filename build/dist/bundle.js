/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const React = __webpack_require__(1);
	const ReactDOM = __webpack_require__(2);
	const Chatbot_1 = __webpack_require__(3);
	ReactDOM.render(React.createElement(Chatbot_1.default, {conversations: []}), document.getElementById("Watson"));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const React = __webpack_require__(1);
	const ChatConversation_1 = __webpack_require__(4);
	const AudioPlayer_1 = __webpack_require__(5);
	const AudioRecorder_1 = __webpack_require__(7);
	const GraphConfig_1 = __webpack_require__(10);
	const SpeechSynthesizer_1 = __webpack_require__(17);
	//TODO: improve conversation history, because it's using a lot of memory. JSArrayData and HTML li list is longer than would be.
	// import specific CSS
	__webpack_require__(19);
	class Chatbot extends React.Component {
	    constructor(props) {
	        super(props);
	        this.state = {
	            conversations: new Array()
	        };
	        this.synthesizer = new SpeechSynthesizer_1.default();
	        this.synthesizer.setCallbackOnRequests(this.onAudioLoadedDonePlayIt.bind(this));
	        GraphConfig_1.default.setOutputStream(this.printer.bind(this));
	        GraphConfig_1.default.addOutputStreamForUserInputs(this.getUserInput.bind(this));
	    }
	    componentDidMount() {
	        this.printer(GraphConfig_1.default.getCurrentKnot().getRandomTemplate());
	    }
	    handleOnKeyDown(e) {
	        if (e.key === Chatbot.Enter) {
	            let who = Chatbot.Me;
	            let what = this.inputElement.value;
	            this.inputElement.value = "";
	            this.pushToConversation(who, what);
	            GraphConfig_1.default.tryNavigateUsing(what);
	        }
	    }
	    onAudioLoadedDonePlayIt(error, blob) {
	        if (!error)
	            this.player.playAudio(blob);
	        else
	            console.error(error);
	    }
	    getUserInput(input) {
	        console.log(input);
	    }
	    printer(input) {
	        let who = "Watson";
	        let what = input.toString();
	        this.pushToConversation(who, what);
	        this.synthesizer.transformTextToSpeech(input);
	    }
	    pushToConversation(who, what) {
	        this.setState((prevState, props) => {
	            prevState.conversations.push(new ChatConversation_1.default({ who: who, what: what }));
	            // Work around to scrol to the last pushed input.
	            // none of other events worked properly.
	            // after 10 ms, that is a lot of time to insert the last entry, than it scrolls down.
	            // the problem is that a simple call doesn't match the last child inserted and the
	            // scroll doesn't show the last entry, because it will be inserted on DOM after last element in here
	            return prevState;
	        });
	        setTimeout(() => this.scrollConversationToTheBottom(), 10);
	    }
	    scrollConversationToTheBottom() {
	        let lastConversationChild = this.conversationList.lastElementChild;
	        if (lastConversationChild) {
	            this.conversationContent.scrollTop = lastConversationChild.offsetTop;
	        }
	    }
	    render() {
	        return (React.createElement("div", {className: "Container"}, 
	            React.createElement("header", null, "Watson Conversational Task Recognition"), 
	            React.createElement("div", {className: "Content"}, 
	                React.createElement("div", {className: "ContentList", ref: (div) => this.conversationContent = div}, 
	                    React.createElement("div", null, 
	                        React.createElement("ul", {ref: (ul) => this.conversationList = ul}, this.state.conversations.map((c, i) => {
	                            return React.createElement(ChatConversation_1.default, {key: i, who: c.props.who, what: c.props.what});
	                        }))
	                    )
	                ), 
	                React.createElement("div", {className: "ContentInput"}, 
	                    React.createElement("input", {ref: (input) => this.inputElement = input, type: "text", id: "inputElement", onKeyDown: this.handleOnKeyDown.bind(this), placeholder: "Enter some command to Watson..."})
	                )), 
	            React.createElement(AudioPlayer_1.default, {ref: (audioPlayerTag) => this.player = audioPlayerTag}), 
	            React.createElement(AudioRecorder_1.default, {ref: (audioRecorderTag) => this.recorder = audioRecorderTag}), 
	            React.createElement("canvas", {name: "AudioWaves"})));
	    }
	}
	Chatbot.Enter = "Enter";
	Chatbot.Me = "Me";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Chatbot;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const React = __webpack_require__(1);
	class ChatConversation extends React.Component {
	    render() {
	        return (React.createElement("li", null, 
	            React.createElement("b", null, this.props.who), 
	            " says: ", 
	            React.createElement("span", null, this.props.what)));
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ChatConversation;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const React = __webpack_require__(1);
	const Queue_1 = __webpack_require__(6);
	class AudioPlayer extends React.Component {
	    constructor(arg) {
	        super(arg);
	        this.blobQueue = new Queue_1.default();
	    }
	    playAudio(blob) {
	        this.blobQueue.enqueue(blob);
	        if (this.isPaused()) {
	            this.onAudioEnded();
	        }
	    }
	    onAudioEnded() {
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
	    isPaused() {
	        console.log(this.audioTagElement.paused);
	        return this.audioTagElement.paused;
	    }
	    componentDidMount() {
	        this.audioTagElement = document.getElementById("audioTag");
	        this.audioTagElement.onended = this.onAudioEnded.bind(this);
	        this.sourceTagElement = this.audioTagElement.getElementsByTagName("source")[0];
	    }
	    render() {
	        return (React.createElement("div", {hidden: true}, 
	            React.createElement("audio", {controls: true, id: "audioTag"}, 
	                React.createElement("source", {id: "voiceTag", type: "audio/ogg"})
	            )
	        ));
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AudioPlayer;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	class Queue {
	    constructor() {
	        this.things = new Array();
	    }
	    enqueue(thing) {
	        if (this.things) {
	            this.things.push(thing);
	        }
	    }
	    dequeue() {
	        let thing = null;
	        if (this.things.length > 0) {
	            thing = this.things[0];
	            this.things.splice(0, 1);
	        }
	        return thing;
	    }
	    isEmpty() {
	        return this.things.length === 0;
	    }
	    count() {
	        return this.things.length;
	    }
	    clear() {
	        this.things = new Array();
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Queue;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const React = __webpack_require__(1);
	const AudioWave_1 = __webpack_require__(8);
	const Queue_1 = __webpack_require__(6);
	class AudioRecorder extends React.Component {
	    constructor(args) {
	        super(args);
	        this.audioBufferQueue = new Queue_1.default();
	        this.audioWave = new AudioWave_1.default("AudioWaves");
	        this.audioRawIndex = 0;
	        this.audioRaw = new Float32Array(2048000);
	        this.recordingTime = 0;
	        this.bufferSize = 1024;
	        this.numberOfChannels = 1;
	        this.frameCount = 0;
	        navigator.getUserMedia({ audio: true }, this.successGetUserMediaCallback.bind(this), this.errorGetUserMediaCallback.bind(this));
	    }
	    successGetUserMediaCallback(stream) {
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
	    errorGetUserMediaCallback(mediaError) {
	        console.error(mediaError);
	        this.mediaRec = null;
	        return null;
	    }
	    startTimeWatcher() {
	        this.recordingTime = 0;
	        setInterval(() => {
	            this.recordingTime++;
	            if (this.recordingTime >= AudioRecorder.MaxRecordTime) {
	                this.recordingTime = 0;
	            }
	        }, 1000);
	    }
	    audioProcessing(event) {
	        if (this.hasMediaStream()) {
	            this.previousFloatArrayData = this.currentFloatArrayData;
	            this.currentFloatArrayData = event.inputBuffer.getChannelData(0);
	            if (this.previousFloatArrayData) {
	                this.audioWave.bufferToShow(this.currentFloatArrayData);
	            }
	            this.setMaxRecordTimeFrame();
	        }
	    }
	    hasMediaStream() {
	        return !!this.mediaRec;
	    }
	    setMaxRecordTimeFrame() {
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
	        return (React.createElement("div", {hidden: true}, 
	            React.createElement("div", null, 
	                React.createElement("audio", {ref: (audioTag) => this.audioTag = audioTag, controls: true}, 
	                    React.createElement("source", {ref: (sourceTag) => this.sourceTag = sourceTag})
	                )
	            )
	        ));
	    }
	}
	AudioRecorder.MaxRecordTime = 10;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AudioRecorder;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	class AudioWave {
	    constructor(canvasElementName) {
	        this.maxWaveWidth = 1;
	        this.maxWaveHeight = 1;
	        this.currentIndex = 0;
	        this.visualThreshold = 50;
	        this.setElementsAndCanvasHandler(canvasElementName);
	    }
	    bufferToShow(floatArray) {
	        if (this.canvasElement) {
	            this.clearCanvas();
	            this.drawThresholdLine();
	            for (let i = 0; i < this.maxWaveWidth && i < floatArray.length; i++) {
	                let f = floatArray[i] * this.maxWaveHeight;
	                this.lineShow(f, i);
	            }
	        }
	    }
	    lineShow(f, i) {
	        this.context2d.beginPath();
	        this.context2d.moveTo(i, 0);
	        let normalizedValue = f * this.maxWaveHeight;
	        this.context2d.lineTo(i, normalizedValue);
	        this.context2d.stroke();
	        this.context2d.closePath();
	    }
	    drawThresholdLine() {
	        this.context2d.beginPath();
	        this.context2d.moveTo(70, this.visualThreshold);
	        this.context2d.lineTo(this.maxWaveWidth, this.visualThreshold);
	        this.context2d.fillText("THRESHOLD", 0, this.visualThreshold, 100);
	        this.context2d.stroke();
	        this.context2d.closePath();
	    }
	    clearCanvas() {
	        this.context2d.clearRect(0, 0, this.maxWaveWidth, this.maxWaveHeight);
	    }
	    setElementsAndCanvasHandler(canvasElementName) {
	        this.canvasElement = null;
	        let timer = setInterval(() => {
	            let canvasElements = document.getElementsByTagName("canvas");
	            for (let i = 0; i < canvasElements.length; i++) {
	                let canvasElement = canvasElements[i];
	                if (canvasElement && canvasElement.getAttribute("name") === canvasElementName) {
	                    this.canvasElement = canvasElement;
	                    console.log(canvasElement);
	                    break;
	                }
	            }
	            if (this.canvasElement) {
	                this.setInvertalToGetMaxWidthAndHeight();
	                this.context2d = this.canvasElement.getContext("2d");
	                this.stardardizeCanvasWidthAndHeight(this.canvasElement);
	                this.canvasElement.onclick = this.defineThresholdOnClick.bind(this);
	                clearInterval(timer);
	            }
	        }, 100);
	    }
	    setInvertalToGetMaxWidthAndHeight() {
	        setInterval(() => {
	            this.getMaxImageWidthAndHeigh(this.canvasElement);
	        }, 1000);
	    }
	    getMaxImageWidthAndHeigh(canvasElement) {
	        this.maxWaveWidth = canvasElement.clientWidth;
	        this.maxWaveHeight = canvasElement.clientHeight;
	    }
	    stardardizeCanvasWidthAndHeight(canvasElement) {
	        canvasElement.width = canvasElement.clientWidth;
	        canvasElement.height = canvasElement.clientHeight;
	    }
	    defineThresholdOnClick(mv) {
	        if (mv.isTrusted)
	            this.visualThreshold = mv.layerY;
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AudioWave;


/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const LinkedGraph_1 = __webpack_require__(11);
	const Knot_1 = __webpack_require__(12);
	let printer = console.log || null;
	let todos = new Array();
	class String {
	    static formatHour(hours, minutes) {
	        let minutesString = (minutes <= 9 ? "0" : "") + minutes.toString();
	        let hoursString = (hours <= 9 ? "0" : "") + hours.toString();
	        return hoursString + ":" + minutesString;
	    }
	}
	//////////////////////////////////////////////
	///     SHOULD BE IN ANOTHER PLACE TO SETUP //
	//////////////////////////////////////////////
	let rootKnot = new Knot_1.default("HCIH?");
	rootKnot.tryAddTemplate("How can i help?");
	rootKnot.tryAddTemplate("What can i do for you?");
	rootKnot.onEntry((input, self, graph, printer) => {
	    let currentTemplate = self.getRandomTemplate();
	    printer(currentTemplate);
	});
	let timeResKnot = new Knot_1.default("WTIIT?");
	timeResKnot.tryAddTemplate("It's <TIME>");
	timeResKnot.tryAddTemplate("<TIME>");
	timeResKnot.onEntry((input, self, graph, printer) => {
	    let template = self.getRandomTemplate();
	    let date = new Date();
	    let HHMM = String.formatHour(date.getHours(), date.getMinutes());
	    let response = template.replace("<TIME>", HHMM);
	    printer(response);
	    graph.goToLastKnot();
	});
	let kindKnot = new Knot_1.default("WAYMF?");
	let kindKnotTArray = ["I'm good stupid, machine remember? And you?", "good. And How are you?", "Awsome. And you?", "Umbelievable Awsome. And you?"];
	kindKnot.addTemplates(kindKnotTArray);
	kindKnot.onEntry((input, self, graph, printer) => {
	    let template = self.getRandomTemplate();
	    printer(template);
	});
	let kindResponseKnot = new Knot_1.default("KRFUR");
	let oksTemplates = ["Ok! Let's go to another command!", "Ok!", "Ok! Let's do something intersting..."];
	kindResponseKnot.addTemplates(oksTemplates);
	kindResponseKnot.onEntry((input, self, graph, printer) => {
	    let template = self.getRandomTemplate();
	    printer(template);
	    graph.goToRoot();
	});
	let markTodo = new Knot_1.default("MTWD");
	let marksResponse = ["Ok, now say what's the description", "What is the description?"];
	markTodo.addTemplates(marksResponse);
	markTodo.onEntry((input, self, graph, printer) => {
	    let template = self.getRandomTemplate();
	    printer(template);
	});
	let markTodoWithDescription = new Knot_1.default("MTWDNOW");
	let markTodoWIthDescriptionTemplates = ["\"<TODO>\" marked properly", "I saved: \"<TODO>\""];
	markTodoWithDescription.addTemplates(markTodoWIthDescriptionTemplates);
	markTodoWithDescription.onEntry((input, self, graph, printer) => {
	    let template = self.getRandomTemplate();
	    let response = template.replace("<TODO>", input);
	    printer(response);
	    todos.push(input);
	    graph.goToRoot();
	});
	let listTodo = new Knot_1.default("LTWD");
	let listTodoResponse = ["Your tasks are: <TODOS>"];
	listTodo.addTemplates(listTodoResponse);
	listTodo.onEntry((input, self, graph, printer) => {
	    let template = self.getRandomTemplate().toString();
	    let todosList = "";
	    let response = "You don't have any task to do!";
	    if (todos.length > 0) {
	        todos.forEach((todo, index) => {
	            if (index > 0) {
	                todosList += ", ";
	            }
	            todosList += todo;
	            if (index == todos.length - 1) {
	                todosList += ".";
	            }
	        });
	        response = template.replace("<TODOS>", todosList);
	        todosList += "";
	    }
	    printer(response);
	    graph.goToRoot();
	});
	let clearTodos = new Knot_1.default("ClearAllTodos");
	let clearTodosTemplates = ["All your todos cleared", "Now you have no todos", "tasks list cleared!"];
	clearTodos.addTemplates(clearTodosTemplates);
	clearTodos.onEntry((input, self, graph, printer) => {
	    let template = self.getRandomTemplate().toString();
	    todos = new Array();
	    printer(template);
	    graph.goToRoot();
	});
	let eraseOneTask = new Knot_1.default("eraseOneTask");
	let eraseOneTaskTemplate = ["Task \"<TODO>\" was deleted!", "You don't have to <TODO> anymore."];
	eraseOneTask.addTemplates(eraseOneTaskTemplate);
	eraseOneTask.onEntry((input, self, graph, printer) => {
	    let template = self.getRandomTemplate().toString();
	    let matchesIndex = input.match(/\w*(\d+)/);
	    let response = "";
	    try {
	        let taskIndex = parseInt(matchesIndex[1]);
	        if (taskIndex < todos.length) {
	            let task = todos[taskIndex];
	            response = template.replace("<TODO>", task);
	            todos = todos.splice(taskIndex, 1);
	        }
	        else
	            throw "Index don't matches!";
	    }
	    catch (e) {
	        //console.
	        response = "No task was removed!";
	    }
	    printer(response);
	    graph.goToRoot();
	});
	//////////////////////////////////////////////
	const graph = new LinkedGraph_1.default(rootKnot);
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = graph;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	class LinkedGraph {
	    constructor(root) {
	        this.knots = {};
	        this.rootKnot = this.currentKnot = this.knots[root.name] = root;
	        this.outStreams = new Array();
	    }
	    tryLinkKnotsViaWith(origin, via, threshold, destiny) {
	        try {
	            // set knot to the knots if it not exists
	            let originKnot = this.knots[origin.name] = this.knots[origin.name] || origin;
	            let destinyKnot = this.knots[destiny.name] = this.knots[destiny.name] || destiny;
	            if (originKnot && destinyKnot) {
	                return originKnot.tryAddChildViaWith(via, threshold, destinyKnot);
	            }
	            else
	                throw new Error("Knots already linked via this edge");
	        }
	        catch (e) {
	            // knot not found or already linked
	            console.error(e.message);
	        }
	        return false;
	    }
	    /**
	     * @description Try to navigate to new knot on the knots
	     */
	    tryNavigateUsing(input) {
	        try {
	            let possiblesDestinations = this.currentKnot.getChildrenSortedVia(input);
	            if (possiblesDestinations.length > 0) {
	                let futureKnot = possiblesDestinations[0]; // most significant
	                // add via new path
	                if (futureKnot.getCurrentSimilarity() > LinkedGraph.ADDITION_SIMILARITY_THRESHOLD) {
	                    let meanThreshold = this.currentKnot.getMeanThreshold();
	                    this.tryLinkKnotsViaWith(this.currentKnot, input, meanThreshold, futureKnot);
	                }
	                // keep current state
	                if (!this.currentKnot.equals(futureKnot)) {
	                    this.currentKnot = futureKnot;
	                }
	                // only navigate after assignment!
	                futureKnot.navigateToItWith(input, this, this.outStream);
	                this.sendRequestToOutputStreamWithUserInput(input);
	                return true;
	            }
	            else
	                throw LinkedGraph.getRandonErrorMessage();
	        }
	        catch (e) {
	            this.sendRequestToOutputStream(e);
	            this.currentKnot.failWith(input, this);
	        }
	        return false;
	    }
	    /**
	     * @description Backtrack
	     */
	    goToLastKnot() {
	        if (this.currentKnot.hasParent()) {
	            this.currentKnot = this.currentKnot.getParent();
	        }
	    }
	    /**
	     * @description Go to root knot
	     */
	    goToRoot() {
	        this.currentKnot = this.getRoot();
	    }
	    /**
	     * @description Get current knot on navigation
	     */
	    getCurrentKnot() {
	        return this.currentKnot;
	    }
	    /**
	     * @description set output stream to use comunicate with outside with internal messages
	     */
	    setOutputStream(outStream) {
	        this.outStream = outStream;
	    }
	    /**
	     * @description Add outside stream for custom compute.
	    */
	    addOutputStreamForUserInputs(outStream) {
	        this.outStreams.push(outStream);
	    }
	    /**
	     * @description Get root knot
	     */
	    getRoot() {
	        return this.rootKnot;
	    }
	    /**
	     * @description send a request to output stream
	     */
	    sendRequestToOutputStream(buffer) {
	        if (!!this.outStream) {
	            this.outStream(buffer);
	        }
	    }
	    /**
	     * @description expose user input to outside processing
	    */
	    sendRequestToOutputStreamWithUserInput(buffer) {
	        if (this.outStreams.length > 0) {
	            this.outStreams.forEach(outStream => outStream(buffer));
	        }
	    }
	    /**
	     * @description get some randon error message
	     */
	    static getRandonErrorMessage() {
	        let randMsgIndex = Math.floor(Math.random() * LinkedGraph.errorMessages.length);
	        return LinkedGraph.errorMessages[randMsgIndex];
	    }
	}
	LinkedGraph.SIMILARITY_THRESHOLD = 0.6;
	LinkedGraph.ADDITION_SIMILARITY_THRESHOLD = 0.85;
	LinkedGraph.errorMessages = [
	    "I didn't understood what you want!",
	    "No good command specified!",
	    "Some error occurred on processing your request!",
	    "I can't do what you want!"
	];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LinkedGraph;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Jaccard_1 = __webpack_require__(13);
	let jaccard = new Jaccard_1.default(1);
	class Knot {
	    constructor(name) {
	        this.edges = {};
	        this.templates = new Array();
	        this.name = name;
	    }
	    /**
	     * @description Try add child via some command
	     * @param via
	     * @param child
	     * @return boolean returns if child was added or not
	     */
	    tryAddChildViaWith(via, threshold, knot) {
	        let child = this.edges[via];
	        // add child
	        if (child === null || child === undefined) {
	            this.edges[via] = {
	                edge: knot,
	                threshold: threshold
	            };
	            knot.setParent(this);
	            return true;
	        }
	        // do nothing
	        return false;
	    }
	    /**
	     * @description Get children sorted by similarity with input
	     * @param input
	     * @return Knot array sorted
	     */
	    getChildrenSortedVia(input) {
	        let children = new Array();
	        for (let via in this.edges) {
	            let knot = this.edges[via];
	            knot.edge.currentSimilarity = jaccard.similarity(input, via);
	            if (knot.edge.currentSimilarity >= knot.threshold) {
	                children.push(knot.edge);
	            }
	        }
	        children.sort((a, b) => {
	            return b.getCurrentSimilarity() - a.getCurrentSimilarity();
	        });
	        return children;
	    }
	    /**
	     * @description get mean threshold of transition to children
	     */
	    getMeanThreshold() {
	        let count = 0;
	        let sum = 0;
	        for (let via in this.edges) {
	            let knot = this.edges[via];
	            sum += knot.threshold;
	            count++;
	        }
	        return sum / count;
	    }
	    /**
	     * @description Get currentSimilarity
	     */
	    getCurrentSimilarity() {
	        return this.currentSimilarity;
	    }
	    /**
	     * @description Try to add a template response
	     */
	    tryAddTemplate(template) {
	        if (this.templates.indexOf(template) < 0) {
	            this.templates.push(template);
	            return true;
	        }
	        return false;
	    }
	    /**
	     * @description Add multiples templates
	     */
	    addTemplates(templates) {
	        templates.forEach(template => this.tryAddTemplate(template));
	    }
	    /**
	     * @description Returns one of the pushed templates
	     */
	    getRandomTemplate() {
	        let randIndex = Math.floor(Math.random() * this.templates.length);
	        return this.templates[randIndex];
	    }
	    /**
	     * @description Set on entry command
	     */
	    onEntry(command) {
	        this.onentryCommand = command;
	    }
	    /**
	     * @description Navigate to it
	     */
	    navigateToItWith(input, graph, printer) {
	        if (this.onentryCommand)
	            this.onentryCommand(input, this, graph, printer);
	    }
	    /**
	     * @description set function on fail entering this knot
	     */
	    onFail(command) {
	        this.onfailcommand = command;
	    }
	    failWith(input, graph) {
	        if (this.onfailcommand)
	            this.onfailcommand(input, this, graph);
	    }
	    /**
	     * @description set parent
	     */
	    setParent(parent) {
	        this.parent = parent;
	    }
	    /**
	     * @description get parent
	     */
	    getParent() {
	        return this.parent;
	    }
	    /**
	     * @description
	     */
	    hasParent() {
	        return !!this.parent;
	    }
	    /**
	     * @description Test equality
	     */
	    equals(other) {
	        return this.name === other.name;
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Knot;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Set_1 = __webpack_require__(14);
	const ShingleBased_1 = __webpack_require__(15);
	class Jaccard extends ShingleBased_1.default {
	    /**
	     * The strings are first transformed into sets of k-shingles (sequences of k
	     * characters), then Jaccard index is computed as |A inter B| / |A union B|.
	     * The default value of k is 3.
	     *
	     * @param k
	     */
	    constructor(k) {
	        super(k);
	    }
	    /**
	     * Compute jaccard index: |A inter B| / |A union B|.
	     * @param s1
	     * @param s2
	     * @return
	     */
	    similarity(s1, s2) {
	        let profile1 = this.getProfile(s1);
	        let profile2 = this.getProfile(s2);
	        let union = new Set_1.default();
	        union.addAll(profile1.getKeys());
	        union.addAll(profile2.getKeys());
	        let inter = 0;
	        union.forEach((key) => {
	            if (profile1.contains(key) && profile2.contains(key)) {
	                inter++;
	            }
	        });
	        return 1.0 * inter / union.size();
	    }
	    /**
	     * Distance is computed as 1 - similarity.
	     * @param s1
	     * @param s2
	     * @return
	     */
	    distance(s1, s2) {
	        return 1.0 - this.similarity(s1, s2);
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Jaccard;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	class Set {
	    constructor() {
	        this.hash = {};
	    }
	    contains(key) {
	        return !!this.hash[key];
	    }
	    addAll(keys) {
	        keys.forEach(this.add.bind(this));
	    }
	    add(key) {
	        this.hash[key] = true;
	    }
	    remove(key) {
	        delete this.hash[key];
	    }
	    forEach(runCallback) {
	        for (let key of Object.keys(this.hash)) {
	            runCallback(key);
	        }
	    }
	    size() {
	        return Object.keys(this.hash).length;
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Set;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Map_1 = __webpack_require__(16);
	class ShingleBased {
	    /**
	     *
	     * @param k
	     */
	    constructor(k) {
	        if (k <= 0) {
	            throw new Error("k should be positive!");
	        }
	        this.k = k;
	    }
	    /**
	     * Return k, the length of k-shingles (aka n-grams).
	     *
	     * @return
	     */
	    getK() {
	        return this.k;
	    }
	    /**
	     * Compute and return the profile of s, as defined by Ukkonen "Approximate
	     * string-matching with q-grams and maximal matches".
	     * https://www.cs.helsinki.fi/u/ukkonen/TCS92.pdf
	     * The profile is the number of occurrences of k-shingles, and is used to
	     * compute q-gram similarity, Jaccard index, etc.
	     * Pay attention: the memory requirement of the profile can be up to
	     * k * size of the string
	     *
	     * @param string
	     * @return the profile of this string, as an unmodifiable Map
	     */
	    getProfile(fullString) {
	        let shingles = new Map_1.default();
	        let string_no_space = fullString.replace(ShingleBased.SPACE_REG, " ");
	        for (let i = 0; i < (string_no_space.length - this.k + 1); i++) {
	            let shingle = string_no_space.substring(i, i + this.k);
	            let value = shingles.contains(shingle) ? shingles.getValue(shingle) + 1 : 1;
	            shingles.setValue(shingle, value);
	        }
	        return shingles;
	    }
	}
	ShingleBased.DEFAULT_K = 3;
	/**
	 * Pattern for finding multiple following spaces.
	 */
	ShingleBased.SPACE_REG = new RegExp(/\s+/);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ShingleBased;


/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	class Map {
	    constructor() {
	        this.obj = {};
	    }
	    contains(key) {
	        return !!this.obj[key];
	    }
	    setValue(key, value) {
	        this.obj[key] = value;
	    }
	    getValue(key) {
	        return this.obj[key];
	    }
	    getKeys() {
	        return Object.keys(this.obj);
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Map;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const voices = ["en-US_LisaVoice", "pt-BR_IsabelaVoice", "en-US_MichaelVoice", "en-US_AllisonVoice"];
	const watsonApiUrl = "https://watson-api-explorer.mybluemix.net/text-to-speech/api/v1/synthesize?accept=audio%2Fogg%3Bcodecs%3Dopus";
	const Requester_1 = __webpack_require__(18);
	const Queue_1 = __webpack_require__(6);
	class SpeechSynthesizer {
	    constructor() {
	        this.textQueue = new Queue_1.default();
	        this.isRequesting = false;
	        this.watchForSomeTextToPlay();
	    }
	    setCallbackOnRequests(callback) {
	        this.callback = callback;
	    }
	    transformTextToSpeech(text) {
	        this.textQueue.enqueue(text);
	    }
	    watchForSomeTextToPlay() {
	        setInterval(() => {
	            if (!this.isRequesting) {
	                this.makeSynthesizerRequest();
	            }
	        }, 250);
	    }
	    makeSynthesizerRequest() {
	        if (!this.textQueue.isEmpty()) {
	            this.isRequesting = true;
	            let text = this.textQueue.dequeue();
	            const finalUrl = watsonApiUrl + voices[0];
	            Requester_1.default
	                .postTextAndReceiveVoice(finalUrl, text)
	                .then(res => {
	                return res.blob();
	            })
	                .then((blob) => {
	                this.callback(null, blob);
	                if (!this.textQueue.isEmpty()) {
	                    this.makeSynthesizerRequest();
	                }
	                else {
	                    this.isRequesting = false;
	                }
	            })
	                .catch(reason => {
	                this.callback(reason, null);
	                this.isRequesting = false;
	            });
	        }
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SpeechSynthesizer;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/// <reference path="../typings/whatwg-streams/whatwg-streams.d.ts" />
	/// <reference path="../typings/whatwg-fetch/whatwg-fetch.d.ts" />
	"use strict";
	class Requester {
	    static postTextAndReceiveVoice(url, text) {
	        let textJson = JSON.stringify({ text: text });
	        return fetch(url, {
	            method: "POST",
	            headers: new Headers({
	                "Content-Type": "application/json",
	                "Accept": "audio/ogg"
	            }),
	            body: textJson
	        });
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Requester;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(22)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./Chatbot.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./Chatbot.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(21)();
	// imports
	
	
	// module
	exports.push([module.id, "*\r\n{\r\n    padding: 0;\r\n    margin: 0;\r\n    font-family: Arial, Helvetica, sans-serif;\r\n}\r\nhtml, body\r\n{\r\n    height: 100%;\r\n}\r\n\r\nheader, canvas\r\n{\r\n    position: fixed;\r\n    width: 100%;\r\n    background-color: darkorange;\r\n    text-align: center;\r\n}\r\n\r\nheader {\r\n    top: 0px;\r\n    height: 50px;\r\n    font-size: 24px;\r\n    z-index: 1000;\r\n    color: white;\r\n    text-decoration-style: double;\r\n    text-shadow:2px 2px black;\r\n    text-rendering: geometricPrecision;\r\n    text-align: center;\r\n\r\n}\r\n\r\ncanvas {\r\n    bottom: 0px;\r\n    height: 100px;\r\n    cursor: default;\r\n}\r\n\r\n.Container\r\n{\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n.Content {\r\n    top: 10%;\r\n    width: 400px;\r\n    height: 400px;\r\n    left: calc(50% - 400px + 200px);\r\n    position: fixed;\r\n    overflow-y: hidden;\r\n    overflow-x: visible;\r\n    border-width: 1px;\r\n    border-color: aqua;\r\n    border-radius: 50px;\r\n    border-style: solid;\r\n\r\n    -webkit-box-shadow: 0px 0px 60px 10px rgba(0,0,0,1);\r\n    -moz-box-shadow: 0px 0px 60px 10px rgba(0,0,0,1);\r\n    box-shadow: 0px 0px 60px 10px rgba(0,0,0,1);\r\n}\r\n\r\n.ContentList, .ContentInput {\r\n    position: relative;\r\n    margin-top: 10px;\r\n    width: 300px;\r\n    left: calc(50% - 150px);\r\n} \r\n\r\n.ContentList {\r\n    padding-top: 5%;\r\n    height: 300px;\r\n    top: 0%;\r\n    overflow-y: auto;\r\n    scroll-behavior: smooth;\r\n}\r\n\r\n.ContentInput {\r\n    height: 50px;\r\n    bottom: 0%;\r\n}\r\n\r\n.ContentInput input {\r\n    border-radius: 100px;\r\n    border-width: 1px;\r\n    border-color: white;\r\n    border-style: solid;\r\n    padding: 10px;\r\n\r\n    width: 90%;\r\n}\r\n\r\n\r\n::-webkit-scrollbar {\r\n    width: 12px;\r\n}\r\n \r\n::-webkit-scrollbar-track {\r\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); \r\n    border-radius: 10px;\r\n}\r\n \r\n::-webkit-scrollbar-thumb {\r\n    border-radius: 10px;\r\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); \r\n}", ""]);
	
	// exports


/***/ },
/* 21 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map