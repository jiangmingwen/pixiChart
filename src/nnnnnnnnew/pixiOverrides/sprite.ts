import type { SpriteOptions } from "pixi.js";
import { Sprite } from "pixi.js";

export class SESprite extends Sprite {
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

    constructor(options?: SpriteOptions) {
        super(options);
    }

}