export default class AudioWave {
    
    private context2d : CanvasRenderingContext2D;
    private canvasElement : HTMLCanvasElement; 
    private maxWaveWidth : number = 1;
    private maxWaveHeight : number = 1;
    private currentIndex : number = 0;
    private visualThreshold : number = 50;
    

    constructor(canvasElementName:string) {
        this.setElementsAndCanvasHandler(canvasElementName);
    }

    public bufferToShow(floatArray:Float32Array) {
        
        this.clearCanvas();
        this.drawThresholdLine();
        for(let i = 0; i < this.maxWaveWidth && i < floatArray.length; i++) {
            let f = floatArray[i] * this.maxWaveHeight;
            this.lineShow(f, i);
        }
    }

    public lineShow(f:number, i:number){
        this.context2d.beginPath();
        this.context2d.moveTo(i, 0);
        let normalizedValue = f * this.maxWaveHeight;
        this.context2d.lineTo(i, normalizedValue);
        this.context2d.stroke();
        this.context2d.closePath();
    }

    public drawThresholdLine() {
        this.context2d.beginPath();
        this.context2d.moveTo(0, this.visualThreshold);
        this.context2d.lineTo(this.maxWaveWidth, this.visualThreshold);
        this.context2d.stroke();
        this.context2d.closePath();
    }

    public clearCanvas() {
        this.context2d.clearRect(0, 0, this.maxWaveWidth, this.maxWaveHeight * 100);
    }

    private writeWaveFormToCanvasImage(floatArray:Float32Array) {
        // request a write to canvas into a web worker
        let imageData = this.context2d.getImageData(0, 0, this.maxWaveWidth, this.maxWaveHeight);
        

        // let na = new Array<number>();
        let index = 0;
        // console.log(imageData.width, "x", imageData.height);

        for(let i = 0; i < imageData.height; i++) {
            
            
            for(let j = 0; j < imageData.width && j < floatArray.length; j++) {

                let f = floatArray[j] * this.maxWaveHeight;

                if (f <= i) {
                    index = i * imageData.width + j;
                    // na.push(index);
                    imageData.data[index    ] = 128;
                    imageData.data[index + 1] = 128;
                    imageData.data[index + 2] = 128;
                    imageData.data[index + 3] = 255;
                }
                else {
                    break;
                }
            }
        }



        // for(index = 0; index < imageData.data.length; index+=4) {

        //     imageData.data[index    ] = 255;
        //     imageData.data[index + 1] = 0;
        //     imageData.data[index + 2] = 0;
        //     imageData.data[index + 3] = 255;
        // }

        
        // if (this.s && na.length > 10) {
        //     console.log(na);
        //     this.s = false;
        // }

        this.context2d.putImageData(imageData, 0, 0, 0, 0, this.maxWaveWidth, this.maxWaveHeight);
    }

    // private s = true;

    private setElementsAndCanvasHandler(canvasElementName:string) {

        this.canvasElement = null;

        let timer = setInterval(() => {
            let canvasElements = document.getElementsByTagName("canvas") as NodeListOf<HTMLCanvasElement>;
            for(let i = 0; i < canvasElements.length; i++) {
                let canvasElement = canvasElements[i];
                if (canvasElement) {
                    this.canvasElement = canvasElement;
                    console.log(canvasElement);
                    break; 
                }
            }

            if (this.canvasElement) {

                this.setInvertalToGetMaxWidthAndHeight();
                this.context2d = this.canvasElement.getContext("2d");
                this.stardardizeCanvasWidthAndHeight(this.canvasElement);
                this.canvasElement.onclick = this.defineThresholdOnClick.bind(this);
                clearInterval(timer);
            }
        }, 100);
    }

    private setInvertalToGetMaxWidthAndHeight() {
        setInterval(()=>{
            this.getMaxImageWidthAndHeigh(this.canvasElement);
        }, 1000);
    }

    private getMaxImageWidthAndHeigh(canvasElement:HTMLCanvasElement) {
        this.maxWaveWidth = canvasElement.clientWidth;
        this.maxWaveHeight = canvasElement.clientHeight;
    }

    private stardardizeCanvasWidthAndHeight(canvasElement:HTMLCanvasElement) {
        canvasElement.width = canvasElement.clientWidth;
        canvasElement.height = canvasElement.clientHeight;
    }

    private defineThresholdOnClick( mv:MouseEvent) {
        
        if (mv.isTrusted) {
            this.visualThreshold = mv.layerY;
            console.log(this.visualThreshold);
        }
    }

}