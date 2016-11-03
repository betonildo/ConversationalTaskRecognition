
class Set {
    private hash : {[key:string] : boolean}; 

    constructor() {
        this.hash = {};
    }

    public contains(key : string) : boolean{
        return !!this.hash[key];
    }

    public addAll(keys : any[]) {
        keys.forEach(this.add.bind(this));
    }

    public add(key : any) {
        this.hash[key] = true;
    }

    public remove(key : any) {
        delete this.hash[key];
    }

    public forEach(runCallback:Function) {

        for (let key of Object.keys(this.hash)) {
            runCallback(key);
        }
    }

    public size() : number {
        return Object.keys(this.hash).length;
    }
}

export default Set;