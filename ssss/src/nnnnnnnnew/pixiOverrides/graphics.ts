import { Graphics, GraphicsOptions } from "pixi.js";

export class SEGraphics extends Graphics {
    id!: string;
    
    __width: number = 0;

    __height: number = 0;

    get width(): number {
        return this.__width;
    }

    set width(value: number) {
        this.__width = value;
    }

    get height(): number {
        return this.__height;
    }

    set height(value: number) {
        this.__height = value;
    }

    constructor(options?: GraphicsOptions) {
        super(options);
        if(options?.width){
            this.width = options.width
        }
        if(options?.height){
            this.height = options.height
        }
    }

}