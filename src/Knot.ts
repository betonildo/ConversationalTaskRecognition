import LinkedGraph from "./LinkedGraph";
import Jaccard from "./Jaccard";

let jaccard = new Jaccard(1);

export default class Knot {

    public name : string;
    private parent : Knot;
    private edges : {[key:string] : {edge:Knot, threshold : number}} = {}; 
    private currentSimilarity : number;
    private minSimilarity : number;
    private templates : Array<string> = new Array<string>();
    private onentryCommand : Function;
    private onfailcommand : Function;
    
    constructor(name:string) {
        this.name = name;
    }

    /**
     * @description Try add child via some command
     * @param via
     * @param child
     * @return boolean returns if child was added or not
     */
    public tryAddChildViaWith(via:string, threshold:number, knot:Knot) : boolean {

        let child = this.edges[via];

        // add child
        if (child === null || child === undefined) {

            this.edges[via] = {
                edge : knot,
                threshold : threshold
            };
            knot.setParent(this);
            return true;
        }
        // do nothing
        
        return false;
    }

    /**
     * @description Get children sorted by similarity with input
     * @param input
     * @return Knot array sorted
     */
    public getChildrenSortedVia(input:string) : Knot[] {

        let children = new Array<Knot>();

        for(let via in this.edges) {
            let knot = this.edges[via]
            knot.edge.currentSimilarity = jaccard.similarity(input, via);
            if (knot.edge.currentSimilarity >= knot.threshold) {
                children.push(knot.edge);
            }
        }

        children.sort( (a, b) => {
            return b.getCurrentSimilarity() - a.getCurrentSimilarity();
        });


        return children;
    }

    /**
     * @description get mean threshold of transition to children
     */
    public getMeanThreshold() : number {
        let count = 0;
        let sum = 0;
        for(let via in this.edges) {
            let knot = this.edges[via]
            sum += knot.threshold;
            count++;
        }

        return sum / count;
    }

    /**
     * @description Get currentSimilarity
     */
    public getCurrentSimilarity() : number {
        return this.currentSimilarity;
    }

    /**
     * @description Try to add a template response
     */
    public tryAddTemplate(template:string) : boolean {
        if (this.templates.indexOf(template) < 0) {
            this.templates.push(template);
            return true;
        }

        return false;
    }

    /**
     * @description Add multiples templates
     */
    public addTemplates(templates:Array<string>) {
        templates.forEach(template => this.tryAddTemplate(template));
    }

    /**
     * @description Returns one of the pushed templates
     */
    public getRandomTemplate() : string {
        let randIndex = Math.floor(Math.random() * this.templates.length);
        return this.templates[randIndex];
    }

    /**
     * @description Set on entry command
     */
    public onEntry(command:Function) {
        this.onentryCommand = command;
    }

    /**
     * @description Navigate to it
     */
    public navigateToItWith(input:string, graph : LinkedGraph, printer:Function) {
        if (this.onentryCommand)
            this.onentryCommand(input, this, graph, printer);
    }

    /**
     * @description set function on fail entering this knot
     */
    public onFail(command:Function) {
        this.onfailcommand = command;
    }

    public failWith(input:string, graph : LinkedGraph) {
        if (this.onfailcommand)
            this.onfailcommand(input, this, graph);
    }

    /**
     * @description set parent
     */
    public setParent(parent:Knot) {
        this.parent = parent;
    }

    /**
     * @description get parent
     */
    public getParent() : Knot{
        return this.parent;
    }

    /**
     * @description 
     */
    public hasParent() : boolean {
        return !!this.parent;
    }

    /**
     * @description Test equality
     */
    public equals(other:Knot) : boolean {
        return this.name === other.name;
    }
}