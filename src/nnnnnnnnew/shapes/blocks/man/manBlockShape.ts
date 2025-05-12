import { BlockShape } from "../blockShape";
import type { IBoundsPoint } from "../type";

export class ManBlockShape extends BlockShape {
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
        this.drawShape()
    }

    drawShape() {

    }

}