import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Graph } from "../nnnnnnnnew/graph/graph";
import type { IReactPixichartInstance, IReactPixichartProps, IUpdateData } from "./type";

export const ReactPixiChart = forwardRef<IReactPixichartInstance, IReactPixichartProps>(({
    diagramId
}, ref) => {
    const domRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<Graph>(null);
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