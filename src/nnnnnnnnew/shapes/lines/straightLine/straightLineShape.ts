import { LineShape } from "../lineShape";

export class StraightLineShape extends LineShape {

    static get shapeType(): string {
        return 'StraightLineShape'
    }
}