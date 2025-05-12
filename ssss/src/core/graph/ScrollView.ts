import { Viewport } from "pixi-viewport";
import { Container, DestroyOptions, Graphics } from "pixi.js";
import { Graph } from "./Graph";
import { ScrollBar } from "./ScrollBar";


export type IOverflow = 'hidden' | 'auto' | 'scroll'

export interface IScrollViewOptions {
    graph: Graph
    diagramWidth: number
    diagramHeight: number

}

const paddingSize = 100

export class ScrollView extends Container {
    viewport: Viewport
    background: Graphics

    graph: Graph

    scrollBar: ScrollBar

    constructor({ graph, diagramHeight, diagramWidth }: IScrollViewOptions) {
        super()
        this.graph = graph
        this.viewport = new Viewport({
            worldWidth: diagramWidth + paddingSize,
            worldHeight: diagramHeight + paddingSize,
            screenHeight: graph.root.clientHeight,
            screenWidth: graph.root.clientWidth,
            events: graph.app.renderer.events,
            ticker: graph.app.ticker
        })
        this.viewport.eventMode = "static";
        this.viewport
            .drag({
                keyToPress: ['Space'],
            })
            .pinch()
            .wheel({
                axis: 'y',
                wheelZoom: false
            })
            .clamp({ direction: 'all' })
            .on('wheel', (e) => {
                if (e.ctrlKey) {
                    const zoom = this.viewport.scale.x + (e.deltaY < 0 ? 0.1 : -0.1)
                    this.viewport.setZoom(Number(zoom.toFixed(2)), true)
                    //todo： 缩放比例的时候，滚动条要重新计算
                } else {
                    this.scrollBar.onScroll(e.deltaX, e.deltaY)
                }
            })
            .on('drag-end', (e) => {
                this.scrollBar.onViewportDragEnd(e)
            })


        window.addEventListener('resize', this.debonceResize.bind(this))

        graph.app.stage.addChild(this.viewport)
        this.background = this.diagram()
        this.scrollBar = new ScrollBar(graph, this.viewport)
        this.preventDefaultEvent()
    }

    /** 组织默认事件 */
    private preventDefaultEvent() {
        // 组织滚轮缩放浏览器
        this.graph.root.addEventListener('wheel', e => {
            e.stopPropagation()
            e.preventDefault()
        })
    }

    debonceTimer: number = -1
    debonceResize() {
        clearTimeout(this.debonceTimer);
        this.debonceTimer = setTimeout(this.onReisze.bind(this), 100);
    }

    onReisze() {
        // 更新 Viewport 的屏幕尺寸
        this.viewport.resize(this.graph.root.clientWidth, this.graph.root.clientHeight);

        // 更新投影矩阵（关键步骤！）
        // this.viewport.fitWorld(true); // 保持原有世界坐标的可见区域
        this.background.width = this.viewport.worldWidth
        this.background.height = this.viewport.worldHeight
        this.scrollBar.resize()
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        window.removeEventListener('resize', this.debonceResize.bind(this))
    }


    diagram() {
        const background = new Graphics()
        background.x = 0
        background.y = 0
        background.rect(0, 0, this.viewport.worldWidth, this.viewport.worldHeight)
        background.fill({
            color: 0xf0f0f0
        })
        this.viewport.addChild(background)
        return background
    }


    add(shape: any) {
        return this.viewport.addChild(shape)
    }


}