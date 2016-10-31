import {Map} from "./Map";
import {Set} from "./Set";
import {ShingleBased} from "./ShingleBased";


class Jaccard extends ShingleBased{

    /**
     * The strings are first transformed into sets of k-shingles (sequences of k
     * characters), then Jaccard index is computed as |A inter B| / |A union B|.
     * The default value of k is 3.
     *
     * @param k
     */
    constructor(k : number = Jaccard.DEFAULT_K) {
        super(k);
    }

    /**
     * Compute jaccard index: |A inter B| / |A union B|.
     * @param s1
     * @param s2
     * @return
     */
    public similarity(s1 : string, s2 : string) : number{
        let profile1 : Map<string,number> = this.getProfile(s1);
        let profile2 : Map<string,number> = this.getProfile(s2);

        let union : Set<String> = new Set<String>();
        union.addAll(profile1.getKeys());
        union.addAll(profile2.getKeys());


        let inter = 0;
        
        union.forEach( key => {
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
    public distance(s1 : string, s2 : string) {
        return 1.0 - this.similarity(s1, s2);
    }
}

export {Jaccard};