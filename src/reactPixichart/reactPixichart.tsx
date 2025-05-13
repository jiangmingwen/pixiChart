import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Graph } from "../nnnnnnnnew/graph/graph";
import { useDrop } from "./dragDrop/dragDropHook";
import type { IReactPixichartInstance, IReactPixichartProps, IUpdateData } from "./type";

export const ReactPixiChart = forwardRef<IReactPixichartInstance, IReactPixichartProps>(({
    diagramId,
    getPreviewData,
    onDragToGraph
}, ref) => {

    const graphRef = useRef<Graph>(null);
    const nestParentRef = useRef<string | undefined>(undefined)
    const domRef = useDrop({
        onDragEnd: (data, event) => {
            if (!graphRef.current || !domRef.current) return
            graphRef.current.interactions.hignlight.hideNest()
            graphRef.current.interactions.drag.hidePreview()
            const position = graphRef.current.getRelativePosition(event, nestParentRef.current)
            onDragToGraph?.(data, position, nestParentRef.current)
        },
        onDragHover: (data, event) => {
            if (!graphRef.current || !domRef.current) return
            graphRef.current.interactions.drag.showPreview(event.clientX, event.clientY, getPreviewData?.(data), true)
            if (graphRef.current.interactions.drag.previewBox) {
                // 探测坐标上的图元之前需要把预览图形隐藏起来
                graphRef.current.interactions.drag.previewBox.visible = false
            }
            const shape = graphRef.current.hitTestByClientPosition(event.clientX, event.clientY)
            if (graphRef.current.interactions.drag.previewBox) {
                graphRef.current.interactions.drag.previewBox.visible = true
            }
            // 探测到拖拽到已有图元上，需要进行嵌套高亮转换
            if (shape) {
                const nestShape = graphRef.current.interactions.drag.getNestParentByType(data.key, shape.id)
                nestParentRef.current = nestShape
                if (nestShape) {
                    graphRef.current.interactions.hignlight.showNest(nestShape)
                } else {
                    graphRef.current.interactions.hignlight.hideNest()
                }
            } else {
                graphRef.current.interactions.hignlight.hideNest()
                nestParentRef.current = undefined
            }

        }
    })

    const isLoaded = useRef(false);
    const dataQueue = useRef<IUpdateData[]>([]);

    useImperativeHandle(ref, () => ({

        compositeUpdateBlocksAndLines: (data: IUpdateData) => {
            if (isLoaded.current) {
                graphRef.current?.updateData(data.blocks, data.lines)
            } else {
                dataQueue.current.push(data)
            }
        }
    }), [])


    useEffect(() => {
        if (domRef.current) {
            graphRef.current = new Graph({
                el: domRef.current,
                width: 2000,
                height: 2000,
                id: diagramId
            });
            // 因为Pixi初始化是异步的，所以需要等初始化完成之后才能进行后续操作
            graphRef.current.init({
                backgroundColor: 0xffffff,
                resizeTo: domRef.current,
            }).then(() => {
                isLoaded.current = true
                dataQueue.current.forEach(data => {
                    graphRef.current?.updateData(data.blocks, data.lines)
                })
                dataQueue.current = []
            })
        }

    }, [])

    return <div style={{ 'width': '100%', 'height': '100%', overflow: 'hidden' }} ref={domRef}></div>
})