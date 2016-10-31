import {Jaccard} from "./Jaccard";

class ConversationGraph {

    private jaccar : Jaccard;
    private graph : {
        [key:string] : {
            current : string,
            dest : string,
            command : Function 
        }
    };
    private root : string;
    private static SIMILARITY_THRESHOLD = 0.6;

    constructor() {
        this.jaccar = new Jaccard(3);
        this.graph = {};
    }

    public setEntryPoint(root : string) {
        this.graph[root] = {
            current : root,
            dest : "",
            command : null
        }

        this.root = root;
    }

    public getRootNode() {
        return this.graph[this.root];
    }

    public setPossiblePath(origin : string, dest : string, command : Function){
        // this is a linked list, but to be a graph, we must consider the destination a array of possibilities
        this.graph[origin] = {
            current : origin,
            dest : dest,
            command : command
        };
    }

    public getPossibleDestinationNodes(possibleDestination : string) {
        

        // TODO: Filter only possibles nodes to not include any of the previous ones 
        let possibleKeys = Object.keys(this.graph).map((gkey) => {
            let node = this.graph[gkey];
            return {
                current : gkey,
                dest : node.dest,
                similarity : this.jaccar.similarity(node.dest.toLowerCase(), possibleDestination.toLowerCase())
            };
        });

        possibleKeys.sort((kl, kr) => {
            return kr.similarity - kl.similarity;
        });

        return possibleKeys;
    }

    public getNode(key : string) {
        return this.graph[key];
    }
}

export default ConversationGraph;