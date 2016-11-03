import Knot from "./Knot";
import Edge from "./Edge";

export default class LinkedGraph {

    private static SIMILARITY_THRESHOLD = 0.6;
    private static ADDITION_SIMILARITY_THRESHOLD = 0.85;

    private knots : {[key:string] : Knot} = {};
    private edges : {[key:string] : Edge} = {};
    private currentKnot : Knot;    

    constructor(root:Knot) {
        this.knots[root.name] = root;
        this.currentKnot = root;
    }

    /**
     * @description Set new knot to this knots
     */
    public setKnot(knot:Knot) {
        this.knots[knot.name] = knot;
    }

    public tryLinkKnotsUsing(e:Edge) : boolean {

        try {
            // set knot to the knots if it not exists
            let originKnot = this.knots[e.origin.name] = this.knots[e.origin.name] || e.origin;
            let destinyKnot = this.knots[e.destiny.name] = this.knots[e.destiny.name] || e.destiny;
            let edge = this.edges[e.via];

            if (edge === null || edge === undefined) {
                // success
                this.edges[e.via] = e;
                return originKnot.tryAddChild(e);
            }
            else throw new Error("Knots already linked via this edge");
        }
        catch(e) {
            // knot not found or already linked
            console.error(e.message);
        }

        return false;
    }

    /**
     * @description Try to navigate to new knot on the knots
     */
    public tryNavigateUsing(input : string) : boolean {
        // let nextChild = this.currentKnot.getChildrenSortedVia(input)[0];

        // // add new link from current knot to the most similar if 
        // // similarity pass the new link to threshold
        // // train...
        // if (nextChild.getCurrentSimilarity() >= LinkedGraph.ADDITION_SIMILARITY_THRESHOLD) {
        //     this.currentKnot.tryAddChild(input, nextChild);
        // }

        // let realNextChild = nextChild.getCurrentSimilarity() < LinkedGraph.SIMILARITY_THRESHOLD ? this.currentKnot : nextChild;

        // this.currentKnot = realNextChild;

        // return realNextChild;
        try {
            let possibleTransitionEdges = this.currentKnot.getChildrenSortedVia(input);
            if (possibleTransitionEdges.length > 0) {
                let futureEdge = possibleTransitionEdges[0]; // most significant
                this.currentKnot = futureEdge.destiny;
                if (futureEdge.command) {
                    futureEdge.command(input);
                }

                if (futureEdge.destiny.getCurrentSimilarity() > LinkedGraph.ADDITION_SIMILARITY_THRESHOLD) {
                    let edge = futureEdge.cloneVia(input);
                    this.tryLinkKnotsUsing(edge);
                }

                return true;
            }
        }
        catch(e) {

        }

        return false;
    }

    /**
     * @description Get current knot on navigation
     */
    public getCurrentKnot() : Knot {
        return this.currentKnot;
    }
}