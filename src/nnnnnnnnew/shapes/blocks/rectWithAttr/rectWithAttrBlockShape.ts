
import { BlockShape } from "../blockShape";
import { IBoundsPoint } from "../type";

export class RectWithAttrBlockShape extends BlockShape {

    static get shapeType(): string {
        return 'ClassBlockShape'
    }



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

        if (x > 0.8 * this.width && y < 40) {
            dy = 40
        }

        return [dx, dy]
    }


    init() {
        console.log(123, 'class')

    }


}