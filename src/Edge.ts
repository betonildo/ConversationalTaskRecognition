import Knot from "./Knot";

export default class Edge {

    public origin : Knot;
    public via : string;
    public destiny : Knot;    
    public command : Function;
    public similarityThreshold : number;

    public equals(other:Edge) : boolean {
        return  this.origin.equals(other.origin) && 
                this.via === other.via &&
                this.destiny.equals(other.destiny);
    }

    public cloneVia(input:string) : Edge{
        let edge = new Edge();
        edge.origin = this.origin;
        edge.via = input;
        edge.destiny = this.destiny;
        edge.similarityThreshold = this.similarityThreshold;
        edge.command = this.command;

        return edge;
    }
}