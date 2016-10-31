class Map<K, V> {

    public contains(key) : boolean {
        return !!this[key];
    }

    public getKeys() : string[] {
        return Object.keys(this);
    }
}

export {Map};