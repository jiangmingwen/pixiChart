import { TextStyle, Text } from "pixi.js";
import { BlockShape } from "../blockShape";
import { IBoundsPoint } from "../type";
import { GlobalStyle } from "../../../config/globalStyle";

export class RectBlockShape extends BlockShape {

    static override  get shapeType() {
        return 'Rect'
    }

    calcVisibleBounds(): IBoundsPoint {
        return [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0]
        ]
    }
    init(): void {
        this.drawLabel()
        this.drawStereotype()
    }

    /** 绘制图元名称 */
    drawLabel() {
        const style = new TextStyle({
            fontSize: GlobalStyle.fontSize,
            fill: { color: GlobalStyle.fontColor },
        });
        const text = `${this.options.label}`;
        const label = new Text({
            text,
            style,
        });
        label.y = GlobalStyle.ContentPadding * 2 + GlobalStyle.StereotypeFontSize
        label.x = this.width / 2 - label.width / 2
        this.addChild(label)
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
            y: GlobalStyle.ContentPadding,
        });
        stereotype.x = this.width / 2 - stereotype.width / 2
        this.addChild(stereotype)
    }

}