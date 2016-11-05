import Map from "./Map";

abstract class ShingleBased {

    protected static DEFAULT_K = 3;

    private k : number;

    /**
     * Pattern for finding multiple following spaces.
     */
    private static SPACE_REG = new RegExp(/\s+/);

    /**
     *
     * @param k
     */
    constructor(k : number) {
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
    public getK() : number {
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
    public getProfile(fullString : string) : Map<number>{
        
        let shingles : Map<number> = new Map<number>();

        let string_no_space = fullString.replace(ShingleBased.SPACE_REG, " ");
        for (let i = 0; i < (string_no_space.length - this.k + 1); i++) {
            let shingle = string_no_space.substring(i, i + this.k);
            let value = shingles.contains(shingle) ? shingles.getValue(shingle) + 1 : 1;            
            shingles.setValue(shingle, value);
        }
        
        return shingles;
    }

}

export default ShingleBased;