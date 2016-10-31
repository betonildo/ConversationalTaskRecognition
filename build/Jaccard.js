"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Set_1 = require("./Set");
var ShingleBased_1 = require("./ShingleBased");
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
