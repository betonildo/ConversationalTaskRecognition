"use strict";
var Map_1 = require("./Map");
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
        var shingles = new Map_1["default"]();
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
exports.__esModule = true;
exports["default"] = ShingleBased;
//# sourceMappingURL=ShingleBased.js.map