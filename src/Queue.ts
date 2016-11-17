export default class Queue<T> {

    private things : Array<T>;

    constructor() {
        this.things = new Array<T>();
    }

    public enqueue(thing:T) {
        if (this.things) {
            this.things.push(thing);
        }
    }

    public dequeue() : T {
        let thing : T = null;
        if (this.things.length > 0) {
            thing = this.things[0];
            this.things.splice(0, 1);
        }
        return thing;
    }

    public isEmpty() : boolean {
        return this.things.length === 0;
    }

    public count() : number {
        return this.things.length;
    }

    public clear() {
        this.things = new Array<T>();
    }
}