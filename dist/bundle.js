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
	ReactDOM.render(React.createElement(Chatbot_1.default, {conversations: []}), document.getElementById("example"));


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
	const ChatConversation_1 = __webpack_require__(8);
	const GraphConfig_1 = __webpack_require__(12);
	class Chatbot extends React.Component {
	    constructor(props) {
	        super(props);
	        this.state = {
	            conversations: new Array()
	        };
	        GraphConfig_1.default.setOutputStream(this.printer.bind(this));
	    }
	    handleOnKeyDown(e) {
	        if (e.key === 'Enter') {
	            let who = "Me";
	            let what = this.inputElement.value;
	            this.inputElement.value = "";
	            let c = new ChatConversation_1.default({ who: who, what: what });
	            let self = this;
	            this.setState((prevState, props) => {
	                prevState.conversations.push(c);
	                return prevState;
	            });
	            GraphConfig_1.default.tryNavigateUsing(what);
	        }
	    }
	    printer(input) {
	        let who = "Watson";
	        let what = input.toString();
	        let c = new ChatConversation_1.default({ who: who, what: what });
	        let self = this;
	        this.setState((prevState, props) => {
	            prevState.conversations.push(c);
	            return prevState;
	        });
	    }
	    componentDidMount() {
	        this.inputElement = document.getElementById("inputElement");
	    }
	    render() {
	        return (React.createElement("div", null, 
	            React.createElement("ul", null, this.state.conversations.map((c, i) => {
	                return React.createElement(ChatConversation_1.default, {key: i, who: c.props.who, what: c.props.what});
	            })), 
	            React.createElement("input", {type: "text", id: "inputElement", onKeyDown: this.handleOnKeyDown.bind(this)})));
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Chatbot;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Set_1 = __webpack_require__(5);
	const ShingleBased_1 = __webpack_require__(6);
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
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Map_1 = __webpack_require__(7);
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
/* 7 */
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
/* 8 */
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
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	"use strict";
	class LinkedGraph {
	    constructor(root) {
	        this.knots = {};
	        this.rootKnot = this.currentKnot = this.knots[root.name] = root;
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
	    "I didn't undertood what you want!",
	    "No good command specified!",
	    "Some error occurred on processing your request!"
	];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LinkedGraph;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Jaccard_1 = __webpack_require__(4);
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const LinkedGraph_1 = __webpack_require__(10);
	const Knot_1 = __webpack_require__(11);
	let printer = console.log || null;
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = graph;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map