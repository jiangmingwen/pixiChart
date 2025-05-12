import { Graphics, TextStyle, Text } from "pixi.js";
import { BlockShape } from "../blockShape";
import { IBoundsPoint } from "../type";
import { minHeight, relativeWidth } from "./config";
import { GlobalStyle } from "../../../config/globalStyle";

export class RectWithHeaderBlockShape extends BlockShape {

    static override  get shapeType() {
        return 'RectWithHeaderBlockShape'
    }

    static override get boundSize() {
        return {
            minHeight: 60,
            minWidth: 100
        }
    }

    static override get boundsPoint() {
        return [
            [0, 0],
            [relativeWidth, 0],
            [relativeWidth, minHeight],
            [1, minHeight],
            [1, 1],
            [0, 1],
            [0, 0]

        ] as IBoundsPoint
    }


    calcVisibleBounds(): IBoundsPoint {
        return RectWithHeaderBlockShape.boundsPoint
    }


    init(): void {
        this.drawHeaderLine()
        this.drawStereotype()
        this.drawLabel()
    }



    /** 绘制头部的横线 */
    drawHeaderLine() {
        const line = new Graphics({ x: 0, y: 0 })
        line.moveTo(0, minHeight)
            .lineTo(relativeWidth * this.width, minHeight)
            .stroke({
                width: 1,
                color: this.options.strokeColor ?? GlobalStyle.strokeColor,
            })
        this.addChild(line)
    }
    /** 绘制图元名称 */
    drawLabel() {
        const style = new TextStyle({
            fontSize: GlobalStyle.StereotypeFontSize,
            fill: { color: GlobalStyle.fontColor },
        });
        const text = `${this.options.label}`;
        const stereotype = new Text({
            text,
            style,
        });
        if (this.options.stereotypeVisible === false) {
            stereotype.y = (this.height - minHeight) / 2
        } else {
            stereotype.y = minHeight + GlobalStyle.ContentPadding * 2 + GlobalStyle.StereotypeFontSize
        }
        stereotype.x = this.width / 2 - stereotype.width / 2
        this.addChild(stereotype)
    }

    /** 绘制构造型 */
    drawStereotype() {
        if (this.options.stereotypeVisible === false) return
        const style = new TextStyle({
            fontSize: GlobalStyle.StereotypeFontSize,
            fill: { color: GlobalStyle.fontColor },
        });
        const text = `«${this.options.stereotype}»`;
        const stereotype = new Text({
            text,
            style,
            y: minHeight + GlobalStyle.ContentPadding,
        });
        stereotype.x = this.width / 2 - stereotype.width / 2
        this.addChild(stereotype)
    }



}