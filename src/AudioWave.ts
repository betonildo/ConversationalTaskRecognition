export default class AudioWave {
    
    private context2d : CanvasRenderingContext2D;
    private canvasElement : HTMLCanvasElement; 
    private maxWaveWidth : number = 1;
    private maxWaveHeight : number = 1;
    private currentIndex : number = 0;
    private visualThreshold : number = 50;
    private halfOfWaveHeight : number;

    constructor(canvasElementName:string) {
        this.setElementsAndCanvasHandler(canvasElementName);
    }

    public bufferToShow(floatArray:Float32Array) {
        
        this.halfOfWaveHeight = this.maxWaveHeight >> 1;
        this.clearCanvas();
        this.drawThresholdLine();
        for(let i = 0; i < this.maxWaveWidth && i < floatArray.length; i++) {
            let f = floatArray[i] * this.maxWaveHeight;
            this.lineShow(f, i);
        }
    }

    public lineShow(f:number, i:number){
        this.context2d.beginPath();
        this.context2d.moveTo(i,  0);
        let normalizedValue = f * this.maxWaveHeight;
        this.context2d.lineTo(i, normalizedValue);
        this.context2d.stroke();
        this.context2d.closePath();
    }

    public drawThresholdLine() {
        this.context2d.beginPath();
        this.context2d.moveTo(70, this.visualThreshold);
        this.context2d.lineTo(this.maxWaveWidth, this.visualThreshold);
        this.context2d.fillText("THRESHOLD", 0, this.visualThreshold, 100);
        this.context2d.stroke();
        this.context2d.closePath();
    }

    public clearCanvas() {
        this.context2d.clearRect(0, 0, this.maxWaveWidth, this.maxWaveHeight * 100);
    }

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

    private defineThresholdOnClick(mv:MouseEvent) {
        
        if (mv.isTrusted) {
            this.visualThreshold = mv.layerY;
            console.log(this.visualThreshold);
        }
    }

}