import Jaccard from "./Jaccard";
import Edge from "./Edge";

let jaccard = new Jaccard(1);

export default class Knot {

    public name : string;
    private edges : {[key:string] : Edge} = {}; 
    private currentSimilarity : number;
    
    constructor(name:string) {
        this.name = name;
    }

    /**
     * @description Try add child via some command
     * @param via
     * @param child
     * @return boolean returns if child was added or not
     */
    public tryAddChild(e:Edge) : boolean {

        let child = this.edges[e.via];

        // add child
        if (child === null || child === undefined) {

            this.edges[e.via] = e;
        }
        // do nothing
        
        return false;
    }

    /**
     * @description Get children sorted by similarity with input
     * @param input
     * @return Knot array sorted
     */
    public getChildrenSortedVia(input:string) : Edge[] {

        let self : Knot = this;

        let children = Object.keys(this.edges).map(edgeKey => {
            let edge = self.edges[edgeKey];
            edge.destiny.currentSimilarity = jaccard.similarity(input, edge.via);
            return edge;
        })
        .filter( edge => {
            return edge.similarityThreshold >= edge.destiny.getCurrentSimilarity();
        });

        children.sort( (a, b) => {
            return b.destiny.currentSimilarity - a.destiny.currentSimilarity;
        });

        return children;
    }

    /**
     * @description Get currentSimilarity
     */
    public getCurrentSimilarity() : number {
        return this.currentSimilarity;
    }

    public equals(other:Knot) : boolean {
        return this.name === other.name;
    }
}