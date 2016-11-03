class Map<V> {

    private obj : {[key:string]:V}

    constructor() {
        this.obj = {};
    }

    public contains(key:string) : boolean {
        return !!this.obj[key];
    }

    public setValue(key:string, value:V) {
        this.obj[key] = value;
    }

    public getValue(key:string) {
        return this.obj[key];
    }

    public getKeys() : string[] {
        return Object.keys(this.obj);
    }
}

export default Map;