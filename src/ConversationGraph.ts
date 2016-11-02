import {Jaccard} from "./Jaccard";

class ConversationGraph {

    private jaccar : Jaccard;
    private graph : {};

    private static SIMILARITY_THRESHOLD = 0.6;

    constructor() {
        this.jaccar = new Jaccard(3);
        this.graph = {};
    }
}

export default ConversationGraph;