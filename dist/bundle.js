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
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var Hello_1 = __webpack_require__(3);
	var Jaccard_1 = __webpack_require__(4);
	var j = new Jaccard_1.Jaccard(1);
	var ph1 = "Estou cansado pra caramba.";
	var ph2 = "Estou bem cansado.";
	var sim = j.similarity(ph1, ph2);
	console.log(sim);
	ReactDOM.render(React.createElement(Hello_1.Hello, {compiler: "TypeScript", framework: "React"}), document.getElementById("example"));


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
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Hello = (function (_super) {
	    __extends(Hello, _super);
	    function Hello() {
	        _super.apply(this, arguments);
	    }
	    Hello.prototype.render = function () {
	        return React.createElement("h1", null, 
	            "Hello from ", 
	            this.props.compiler, 
	            " and ", 
	            this.props.framework, 
	            "!");
	    };
	    return Hello;
	}(React.Component));
	exports.Hello = Hello;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Set_1 = __webpack_require__(5);
	var ShingleBased_1 = __webpack_require__(6);
	var Jaccard = (function (_super) {
	    __extends(Jaccard, _super);
	    /**
	     * The strings are first transformed into sets of k-shingles (sequences of k
	     * characters), then Jaccard index is computed as |A inter B| / |A union B|.
	     * The default value of k is 3.
	     *
	     * @param k
	     */
	    function Jaccard(k) {
	        if (k === void 0) { k = Jaccard.DEFAULT_K; }
	        _super.call(this, k);
	    }
	    /**
	     * Compute jaccard index: |A inter B| / |A union B|.
	     * @param s1
	     * @param s2
	     * @return
	     */
	    Jaccard.prototype.similarity = function (s1, s2) {
	        var profile1 = this.getProfile(s1);
	        var profile2 = this.getProfile(s2);
	        var union = new Set_1.Set();
	        union.addAll(profile1.getKeys());
	        union.addAll(profile2.getKeys());
	        var inter = 0;
	        union.forEach(function (key) {
	            if (profile1.contains(key) && profile2.contains(key)) {
	                inter++;
	            }
	        });
	        return 1.0 * inter / union.size();
	    };
	    /**
	     * Distance is computed as 1 - similarity.
	     * @param s1
	     * @param s2
	     * @return
	     */
	    Jaccard.prototype.distance = function (s1, s2) {
	        return 1.0 - this.similarity(s1, s2);
	    };
	    return Jaccard;
	}(ShingleBased_1.ShingleBased));
	exports.Jaccard = Jaccard;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var Set = (function () {
	    function Set() {
	        this.hash = {};
	    }
	    Set.prototype.contains = function (key) {
	        return !!this.hash[key];
	    };
	    Set.prototype.addAll = function (keys) {
	        keys.forEach(this.add.bind(this));
	    };
	    Set.prototype.add = function (key) {
	        this.hash[key] = true;
	    };
	    Set.prototype.remove = function (key) {
	        delete this.hash[key];
	    };
	    Set.prototype.forEach = function (runCallback) {
	        for (var _i = 0, _a = Object.keys(this.hash); _i < _a.length; _i++) {
	            var key = _a[_i];
	            runCallback(key);
	        }
	    };
	    Set.prototype.size = function () {
	        return Object.keys(this.hash).length;
	    };
	    return Set;
	}());
	exports.Set = Set;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Map_1 = __webpack_require__(7);
	var ShingleBased = (function () {
	    /**
	     *
	     * @param k
	     */
	    function ShingleBased(k) {
	        if (k === void 0) { k = 3; }
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
	    ShingleBased.prototype.getK = function () {
	        return this.k;
	    };
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
	    ShingleBased.prototype.getProfile = function (fullString) {
	        var shingles = new Map_1.Map();
	        var string_no_space = fullString.replace(ShingleBased.SPACE_REG, " ");
	        for (var i = 0; i < (string_no_space.length - this.k + 1); i++) {
	            var shingle = string_no_space.substring(i, i + this.k);
	            var value = shingles.contains(shingle) ? shingles.getValue(shingle) + 1 : 1;
	            shingles.setValue(shingle, value);
	        }
	        return shingles;
	    };
	    ShingleBased.DEFAULT_K = 3;
	    /**
	     * Pattern for finding multiple following spaces.
	     */
	    ShingleBased.SPACE_REG = new RegExp(/\s+/);
	    return ShingleBased;
	}());
	exports.ShingleBased = ShingleBased;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var Map = (function () {
	    function Map() {
	        this.obj = {};
	    }
	    Map.prototype.contains = function (key) {
	        return !!this.obj[key];
	    };
	    Map.prototype.setValue = function (key, value) {
	        this.obj[key] = value;
	    };
	    Map.prototype.getValue = function (key) {
	        return this.obj[key];
	    };
	    Map.prototype.getKeys = function () {
	        return Object.keys(this.obj);
	    };
	    return Map;
	}());
	exports.Map = Map;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map