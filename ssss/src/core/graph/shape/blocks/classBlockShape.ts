import { GlobalStype } from "../../../shapes/GlobalStyle";
import { SEGraphics } from "../../override/graphics";
import { BaseBlockShape } from "../BaseBlockShape";
import { IBoundsPoint } from "../BlockContainer";
import { IBlockShape } from "../type";

export class ClassBlockShape extends BaseBlockShape {



    calcVisibleBounds(): IBoundsPoint {
        return [
            [40, 0],
            [0.8, 0],
            [0.8, 40],
            [1, 40],
            [1, 1],
            [0, 1],
            [0, 40],
            [40, 40],
            [40, 0]
        ]
    }

    getOffsetPosition(rx: number, ry: number) {
        const x = rx * this.width
        const y = ry * this.height
        let dx = 0, dy = 0;
        if (x >= 0 && x < 40 && y < 40) {
            dy = 40 
        }

        if (x > 0.8 * this.width && y< 40) {
            dy = 40 
        }

        return [dx, dy]
    }

    static get name(): string {
        return 'ClassBlockShape'
    }


    init() {
        console.log(123, 'class')

    }


}