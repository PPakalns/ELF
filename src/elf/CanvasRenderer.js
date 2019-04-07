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
    constructor(inputData, canvas, legendRatio){
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
        this.canvasCtx.font = "20px Arial";
        this.legendRatio = legendRatio; //Should be 0 - 1;

        this.data = {};
        this.initializeArraysWithColors(inputData);
    }

    initializeArraysWithColors(inputData){
        let sortedAscending = Array.from(inputData).sort((a, b) => a.offset - b.offset);
        let maxSize = 0
        for (let val of inputData)
        {
            maxSize = Math.max(maxSize, val.offset + val.size)
        }
        this.data.size = maxSize
        this.data.list = new ColorAdder(sortedAscending).getColorizedList();
    }

    renderCanvas(){
        //Clear canvas
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvasCtx.fillStyle = "grey";
        this.canvasCtx.fillRect(0, 0, this.getRectangleWidth(), this.canvas.height);

        for(let i = 0; i < this.data.list.length; i++){
            let currentElement = this.data.list[i];

            this.renderRectangles(currentElement, this.data.size);
            this.renderLegend(currentElement, i);
        }
    }

    renderLegend(currentElement, i){
        this.canvasCtx.fillRect(this.getRectangleWidth() + 10, i * 20, 20, 20);
        this.canvasCtx.fillStyle = 'black';
        this.canvasCtx.fillText(currentElement.name + " " + currentElement.size, this.getRectangleWidth() + 40, i * 20 + 17,this.getLegendWidth() - 20);
    }

    renderRectangles(currentElement, size){
        this.canvasCtx.fillStyle = currentElement.color;
        this.canvasCtx.fillRect(0, this.calculateHeight(currentElement.offset, size), this.getRectangleWidth(), this.calculateHeight(currentElement.size, size));
    }

    calculateHeight(size, sizeSum){
        return size*this.canvas.height/sizeSum;
    }

    getRectangleWidth(){
        return (1 - this.legendRatio)*this.canvas.width;
    }

    getLegendWidth(){
        return this.legendRatio*this.canvas.width;
    }
}

function InitializeCanvasRenderer(data, canvas, legendRatio) {
    return new CanvasRenderer(data, canvas, legendRatio);
}

export {
    InitializeCanvasRenderer
}
