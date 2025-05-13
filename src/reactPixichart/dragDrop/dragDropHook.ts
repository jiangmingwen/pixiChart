import { useEffect, useRef } from "react"
import { EVENT_DRAG_END, EVENT_DRAG_START } from "./config"
import type { IDragData, IDragDropEvent, IDragParam, IDropParam } from "./type"



export function useDrag<D extends HTMLElement, T extends IDragData = any>({ onDragHover, onDragEnd, dragData, onDragStart }: IDragParam<T>) {
    /** 拖拽的目标dom */
    const elemRef = useRef<D>(null)
    /** 拖拽数据 */
    const dragDataRef = useRef(dragData)

    const isDragging = useRef(false)

    useEffect(() => {
        if (!elemRef.current) return
        dragDataRef.current = dragData

        const onMousemove = (e: MouseEvent) => {
            // 鼠标按下不触发拖拽事件，按下并移动过程中触发一次（避免点击选项就触发事件监听）
            if (isDragging.current === false) {
                const customEvent = new CustomEvent(EVENT_DRAG_START, {
                    detail: {
                        dragData: dragDataRef.current,
                        event: e,
                        dragElem: elemRef.current
                    } as IDragDropEvent<T>
                })
                document.dispatchEvent(customEvent)
                isDragging.current = true
            }
        }


        const onMousedown = () => {
            // 鼠标按下，监听移动
            document.addEventListener('mousemove', onMousemove)
        }


        const onMouseup = (e: MouseEvent) => {
            if (isDragging.current) {
                const customEvent = new CustomEvent(EVENT_DRAG_END, {
                    detail: {
                        dragData: dragDataRef.current,
                        event: e,
                        dragElem: elemRef.current
                    } as IDragDropEvent<T>
                })
                document.dispatchEvent(customEvent)
                isDragging.current = false
            }
            // 鼠标抬起，移除监听移动
            document.removeEventListener('mousemove', onMousemove)
        }

        //通过鼠标事件，模拟拖拽事件，消除浏览器兼容性
        document.addEventListener('mousedown', onMousedown)
        document.addEventListener('mouseup', onMouseup)

        return () => {
            // 卸载，移除监听
            document.removeEventListener('mousedown', onMousedown)
            document.removeEventListener('mouseup', onMouseup)
        }

    }, [])

    return elemRef
}


export function useDrop({ onDragEnd, onDragHover }: IDropParam) {
    /** 释放的画布容器 */
    const elemRef = useRef<HTMLDivElement>(null)
    /** 是否是释放目标画布 */
    const isDropTarget = useRef(false) //分屏的时候，画布可能有多个，结束事件处需要通过是不是进入了画布进行判断
    const draggingData = useRef<any>(null)
    useEffect(() => {
        if (!elemRef.current) return

        const onMouseenter = (e: MouseEvent) => {
            isDropTarget.current = true
            if (!elemRef.current) return
            //鼠标进入，开始监听移动事件
            elemRef.current.addEventListener('mousemove', onMouseMove)
        }


        const onMouseLeave = (e: MouseEvent) => {
            isDropTarget.current = false
            if (!elemRef.current) return
            //鼠标离开，移除监听移动事件
            elemRef.current.removeEventListener('mousemove', onMouseMove)
        }


        const onMouseMove = (e: MouseEvent) => {
            if (!elemRef.current) return
            onDragHover(draggingData.current, e)
        }

        const dragStart = (e: CustomEventInit<IDragDropEvent<any>>) => {
            if (!elemRef.current) return
            elemRef.current.addEventListener('mouseenter', onMouseenter)
            elemRef.current.addEventListener('mouseleave', onMouseLeave)
            draggingData.current = e.detail?.dragData
        }
        const dragEnd = (e: CustomEventInit<IDragDropEvent<any>>) => {
            //拖拽结束，结束事件监听
            if (!elemRef.current) return
            elemRef.current.removeEventListener('mouseenter', onMouseenter)
            elemRef.current.removeEventListener('mouseleave', onMouseLeave)
            elemRef.current!.removeEventListener('mousemove', onMouseMove)
            if (isDropTarget.current) {
                // 是拖入的当前画布，当前画布做事件回调
                onDragEnd(e.detail?.dragData, e.detail!.event)
            }
            isDropTarget.current = false
        }

        document.addEventListener(EVENT_DRAG_START, dragStart)
        document.addEventListener(EVENT_DRAG_END, dragEnd)

        return () => {
            document.removeEventListener(EVENT_DRAG_START, dragStart)
            document.removeEventListener(EVENT_DRAG_END, dragEnd)
            if (!elemRef.current) return
            elemRef.current.removeEventListener('mouseenter', onMouseenter)
            elemRef.current.removeEventListener('mouseleave', onMouseLeave)
            elemRef.current.removeEventListener('mouseenter', onMouseenter)
            elemRef.current.removeEventListener('mouseleave', onMouseLeave)
            elemRef.current!.removeEventListener('mousemove', onMouseMove)
        }
    }, [])


    return elemRef
}