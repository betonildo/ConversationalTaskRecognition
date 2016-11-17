export default class Vector2 {
    public x : number;
    public y : number;

    public static dot(u:Vector2, v:Vector2) : number {
        return u.x * v.x + u.y * v.y;
    }

    public normalize() : Vector2 {
        let norm = this.magnitude();
        let u = this.clone();
        
        u.x = Math.abs(u.x / norm);
        u.y = Math.abs(u.y / norm);


        return u;
    }

    public magnitude() : number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public clone() : Vector2 {
        let u = new Vector2();
        u.x = this.x;
        u.y = this.y;
        return u;
    }

    public static getVminusFloatArray(floatArray:Float32Array) : Vector2 {
        let u = new Vector2();
        u.y = this.meanFloatArrayFromTo(floatArray, 2, floatArray.length - 1);
        u.x = floatArray.length - 2;

        return u;
    }

    public static getVplusFloatArray(floatArray:Float32Array) : Vector2 {
        let u = new Vector2();
        u.y = this.meanFloatArrayFromTo(floatArray, 0, floatArray.length - 3);
        u.x = floatArray.length - 2;

        return u;
    }

    public static getVFloatArray(floatArray:Float32Array) : Vector2 {

        let u = new Vector2();
        u.y = this.meanFloatArrayFromTo(floatArray, 1, floatArray.length - 2);
        u.x = floatArray.length - 2;

        return u;
    }

    public static meanFloatArrayFromTo(floatArray:Float32Array, startIndex:number, endIndex:number) : number {

        let amplitude = 0;
        let length = floatArray.length - 2;

        for(let i = startIndex; i <= endIndex; i++) {
            amplitude += floatArray[i];
        }

        return amplitude / length;
    }
}