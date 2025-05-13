import type { FC } from "react";
import { RectBlockShape } from "./nnnnnnnnew/shapes/blocks/rect/rectBlockShape";
import { useDrag } from "./reactPixichart/dragDrop/dragDropHook";

export const DrawTool: FC = () => {
    const dragRef = useDrag<HTMLButtonElement>({ dragData: { key: 'block', graphType: RectBlockShape.shapeType } })

    return <button ref={dragRef}>模块</button>
}