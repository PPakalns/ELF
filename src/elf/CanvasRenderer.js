class ColorAdder{
    constructor(list) {
        this.colorizedList = [];
        this.list = list;
    }

    getColorizedList(){
        for (let i = 0; i < this.list.length; i++) {
            let newElement = this.list[i];
            newElement.color = this.getColor(i);

            this.colorizedList.push(newElement);
        }

        return this.colorizedList;
    }

    getColor(currentIdx){
        //Color value are from 0 to 1275(brightest available for each shade), array with more than 1275 values will have similar colors
        let value = Math.round(currentIdx*1275/this.list.length);

        if(value >= 0 && value <= 255){
            return ColorAdder.createRGBString(255, value,0);
        }

        if(value > 255 && value <= 510){
            return ColorAdder.createRGBString(510 - value, 255,0);
        }

        if(value > 510 && value <= 765){
            return ColorAdder.createRGBString(0, 255,value - 510);
        }

        if(value > 765 && value <= 1020){
            return ColorAdder.createRGBString(0,  1020 - value,255);
        }

        if(value > 1020 && value <= 1275){
            return ColorAdder.createRGBString(value - 1020, 0,255);
        }

        throw new Error("Color value is out of bounds");
    }

    static createRGBString(r, g, b){
        return "rgb("+r+","+g+","+b+")";
    }
}

class CanvasRenderer{
    constructor(data, canvas, legendRatio){
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
        this.canvasCtx.font = "20px Arial";
        this.sizeSum = data.reduce((accumulator, currentValue) => accumulator + currentValue.size, 0);
        this.list = new ColorAdder(data).getColorizedList();
        this.legendRatio = legendRatio; //Should be 0 - 1;
    }

    renderCanvas(){
        let locationSum = 0;

        for(let i = 0; i < this.list.length; i++){
            let currentElement = this.list[i];

            this.renderRectangles(currentElement, locationSum);
            this.renderLegend(currentElement, locationSum);

            locationSum += currentElement.size;
        }
    }

    renderLegend(currentElement, locationSum){
        this.canvasCtx.fillStyle = 'black';
        this.canvasCtx.fillText(currentElement.name, this.getRectangleWidth() + 10, this.calculateHeight(locationSum) + 18,this.getLegendWidth() - 10);
    }

    renderRectangles(currentElement, locationSum){
        this.canvasCtx.fillStyle = currentElement.color;
        this.canvasCtx.fillRect(0, this.calculateHeight(locationSum), this.getRectangleWidth(), this.calculateHeight(currentElement.size));
    }

    calculateHeight(size){
        return size*this.canvas.height/this.sizeSum;
    }

    getRectangleWidth(){
        return (1 - this.legendRatio)*this.canvas.width;
    }

    getLegendWidth(){
        return this.legendRatio*this.canvas.width;
    }
}

function RenderCanvas(data, canvas, legendRatio) {
    let canvasRenderer = new CanvasRenderer(data, canvas, legendRatio);
    canvasRenderer.renderCanvas();
}

export {
    RenderCanvas
}
