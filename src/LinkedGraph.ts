import Knot from "./Knot";

export default class LinkedGraph {

    private static SIMILARITY_THRESHOLD = 0.6;
    private static ADDITION_SIMILARITY_THRESHOLD = 0.85;
    private static errorMessages : string[] = [
        "I didn't understood what you want!",
        "No good command specified!",
        "Some error occurred on processing your request!",
        "I can't do what you want!"
    ]


    private knots : {[key:string] : Knot} = {};
    private currentKnot : Knot;
    private rootKnot : Knot;
    private outStream : Function;

    constructor(root:Knot) {
        this.rootKnot = this.currentKnot = this.knots[root.name] = root;
    }

    public tryLinkKnotsViaWith(origin:Knot, via:string, threshold:number, destiny:Knot) : boolean {

        try {
            // set knot to the knots if it not exists
            let originKnot = this.knots[origin.name] = this.knots[origin.name] || origin;
            let destinyKnot = this.knots[destiny.name] = this.knots[destiny.name] || destiny;
            if (originKnot && destinyKnot) {
                return originKnot.tryAddChildViaWith(via, threshold, destinyKnot);
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
    public tryNavigateUsing(input:string) : boolean {

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
                if (!this.currentKnot.equals(futureKnot)){                    
                    this.currentKnot = futureKnot;
                }

                // only navigate after assignment!
                futureKnot.navigateToItWith(input, this, this.outStream);
                return true;
            }
            else throw LinkedGraph.getRandonErrorMessage();
        }
        catch(e) {
            this.sendRequestToOutputStream(e);
            this.currentKnot.failWith(input, this);
        }    

        return false;
    }


    /**
     * @description Backtrack
     */
    public goToLastKnot() {
        if (this.currentKnot.hasParent()) {
            this.currentKnot = this.currentKnot.getParent();
        }
    }

    /**
     * @description Go to root knot
     */
    public goToRoot() {
        this.currentKnot = this.getRoot();
    }

    /**
     * @description Get current knot on navigation
     */
    public getCurrentKnot() : Knot {
        return this.currentKnot;
    }

    /**
     * @description set output stream to use comunicate with outside with internal messages
     */
    public setOutputStream(outStream:Function) {
        this.outStream = outStream;
    }

    /**
     * @description Get root knot
     */
    private getRoot() : Knot {
        return this.rootKnot;
    }

    /**
     * @description send a request to output stream
     */
    private sendRequestToOutputStream(buffer:any) {
        if (!!this.outStream) {
            this.outStream(buffer);
        }
    }

    /**
     * @description get some randon error message
     */
    private static getRandonErrorMessage() : string {
        let randMsgIndex = Math.floor(Math.random() * LinkedGraph.errorMessages.length);
        return LinkedGraph.errorMessages[randMsgIndex];
    }
}