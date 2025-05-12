import type { ContainerOptions } from "pixi.js";
import { Container } from "pixi.js";


export class SEContainer extends Container {

    id!: string;

    protected __width: number = 0;

    protected __height: number = 0;

    set width(value: number) {
        this.__width = value;
    }

    set height(value: number) {
        this.__height = value;
    }



    constructor(options?: ContainerOptions) {
        super(options);
        if (options?.width) this.__width = options.width
        if (options?.height) this.__height = options.height
        if (options?.x) this.x = options.x
        if (options?.y) this.y = options.y
    }


}