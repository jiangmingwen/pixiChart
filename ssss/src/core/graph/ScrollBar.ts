import { Viewport, } from "pixi-viewport";
import { Container, FederatedEvent, FederatedWheelEvent, Graphics, Point, PointData } from "pixi.js";
import { Graph } from "./Graph";
import { DragEvent } from "pixi-viewport/dist/types";

const scrollBarSize = 10
const scrollbarColor = 0xbbbbbb
const scrollbarAtiveColor = 0x999999
const scrollGap = 8

export class ScrollBar extends Container {
    /** 横向滚动条 */
    scrollX!: Container
    /** 纵向滚动条 */
    scrollY!: Container
    /** 横向滚动条滑块 */
    thubmX!: Graphics
    /** 纵向滚动条滑块 */
    thubmY!: Graphics
    /** viewport */
    viewport: Viewport
    /** graph */
    graph: Graph
    /** 纵向滚动距离 */
    scrollTop: number = 0
    /** 横向滚动距离 */
    scrollLeft: number = 0

    /**
     * Creates a new ScrollBar instance.
     * @param graph - The Graph instance to attach the scrollbar to
     * @param viewport - The Viewport instance that the scrollbar will control
     */
    constructor(graph: Graph, viewport: Viewport) {
        super()
        this.graph = graph
        this.viewport = viewport
        this.drawScrollBarY()
        this.drawScrollBarX()
    }

    resize() {

        this.scrollY.x = this.viewport.screenWidth - scrollBarSize / 2 - 1
        this.scrollY.y = this.viewport.screenHeight - scrollBarSize / 2 - 1
        this.scrollX.x = this.viewport.screenWidth - scrollBarSize / 2 - 1
        this.scrollX.y = this.viewport.screenHeight - scrollBarSize / 2 - 1
    }

    onScroll(x: number, y: number) {
        this.onScrollX(x)
        this.onScrollY(y)
    }

    onViewportDragEnd({ screen, world }: DragEvent) {
        const scrollTop = world.y - screen.y
        const scrollLeft = world.x - screen.x
        if (scrollLeft != this.scrollLeft) {
            this.scrollLeft = scrollLeft
            this.thubmX.x = this.getThumbPositionX()
        }

        if (scrollTop != this.scrollTop) {
            this.scrollTop = scrollTop
            this.thubmY.y = this.getThumbPositionY()
        }
    }


    private onScrollX(x: number) {
        const {
            screenWidth,
            worldWidth,
            scale: { x: scaleX },
        } = this.viewport;
        const scaledWorldWidth = worldWidth * scaleX;
        const maxScroll = Math.max(scaledWorldWidth - screenWidth, 0);
        let scrollLeft = this.scrollLeft
        scrollLeft += x;
        if (scrollLeft > maxScroll) {
            scrollLeft = maxScroll
        }
        if (scrollLeft < 0) {
            scrollLeft = 0
        }

        if (scrollLeft != this.scrollLeft) {
            this.scrollLeft = scrollLeft
            this.thubmX.x = this.getThumbPositionX()
        }
    }

    private onScrollY(y: number) {
        const {
            screenHeight,
            worldHeight,
            scale: { y: scaleY },
        } = this.viewport;
        const scaledWorldHeight = worldHeight * scaleY;
        const maxScroll = Math.max(scaledWorldHeight - screenHeight, 0);
        let scrollTop = this.scrollTop
        scrollTop += y;
        if (scrollTop > maxScroll) {
            scrollTop = maxScroll
        }
        if (scrollTop < 0) {
            scrollTop = 0
        }

        if (scrollTop != this.scrollTop) {
            this.scrollTop = scrollTop
            this.thubmY.y = this.getThumbPositionY()
        }
    }

    private getThumbPositionX() {
        const {
            screenWidth,
            worldWidth,
            scale: { x: scaleX },
        } = this.viewport;
        const scaledWorldWidth = worldWidth * scaleX;
        const maxScroll = Math.max(scaledWorldWidth - screenWidth, 0);
        const clampedLeft = Math.min(this.scrollLeft * scaleX, maxScroll);
        const scrollRatio = maxScroll > 0 ? clampedLeft / maxScroll : 0;
        // 计算正确的滑块位置
        const thumbX = scrollRatio * (this.trackWidthX - this.thumbSizeX) + this.trackStartX - scrollGap;
        const maxX = this.viewport.screenWidth - this.trackStartX - this.thumbSizeX - scrollGap
        const x = Math.min(Math.max(thumbX, this.trackStartX), maxX);
        return x
    }

    private getThumbPositionY() {
        const {
            screenHeight,
            worldHeight,
            scale: { y: scaleY },
        } = this.viewport;
        const scaledWorldHeight = worldHeight * scaleY;
        const maxScroll = Math.max(scaledWorldHeight - screenHeight, 0);
        const clampedTop = Math.min(this.scrollTop * scaleY, maxScroll);
        const scrollRatio = maxScroll > 0 ? clampedTop / maxScroll : 0;
        // 计算正确的滑块位置
        const thumbY = scrollRatio * (this.trackHeightY - this.thumbSizeY) + this.trackStartY - scrollGap;
        const maxY = this.viewport.screenHeight - this.trackStartY - this.thumbSizeY - scrollGap
        const y = Math.min(Math.max(thumbY, this.trackStartY), maxY);
        return y
    }

    /**
     * 新增辅助方法 - 计算垂直滚动条轨道高度
     */
    private get trackHeightY(): number {
        return this.viewport.screenHeight
            - 2 * scrollBarSize   // 上下箭头占用的高度
            - 2 * scrollGap       // 轨道上下间隙
            - 2;                  // 边框补偿
    }

    /**
     * 新增辅助方法 - 获取轨道起始Y坐标
     */
    private get trackStartY(): number {
        return scrollBarSize    // 上箭头高度
            + scrollGap           // 顶部间隙
            + 1;                  // 边框补偿
    }


    private get thumbSizeX() {
        const scaledWorldWidth = this.viewport.worldWidth * this.viewport.scale.x;
        const ratio = this.viewport.screenWidth / scaledWorldWidth;
        return Math.min(ratio * this.trackWidthX, this.trackWidthX);
    }

    private get thumbSizeY() {
        const scaledWorldHeight = this.viewport.worldHeight * this.viewport.scale.y;
        const ratio = this.viewport.screenHeight / scaledWorldHeight;
        return Math.min(ratio * this.trackHeightY, this.trackHeightY);

    }

    /**
     * 新增辅助方法 - 计算垂直滚动条轨道高度
     */
    private get trackWidthX(): number {
        return this.viewport.screenWidth
            - 2 * scrollBarSize   // 上下箭头占用的高度
            - 2 * scrollGap       // 轨道上下间隙
            - 2;                  // 边框补偿
    }

    /**
     * 新增辅助方法 - 获取轨道起始Y坐标
     */
    private get trackStartX(): number {
        return scrollBarSize    // 上箭头高度
            + scrollGap           // 顶部间隙
            + 1;                  // 边框补偿
    }


    drawScrollBarX() {
        const bar = new Container({
            x: 0,
            y:  this.viewport.screenHeight-scrollBarSize -1,
            width: this.viewport.screenWidth,
            height: scrollBarSize
        })
        const left = new Graphics()
        left.moveTo(1, scrollBarSize/2)
            .lineTo(1 + scrollBarSize, 0)
            .lineTo(1 + scrollBarSize, scrollBarSize)
            .lineTo(1, scrollBarSize/2)
            .fill({
                color: scrollbarColor
            })
        left.interactive = true
        left.on('mouseenter', () => {
            left.fillStyle.color = scrollbarAtiveColor
            left.endFill()
        })
        left.on('mouseleave', () => {
            left.fillStyle.color = scrollbarColor
            left.endFill()
        })
        left.onclick = () => {
            this.viewport.x += 100
            this.viewport.emit('wheel', {
                type: 'animate',
                deltaX: -100,
                deltaY: 0,
            } as unknown as FederatedWheelEvent)
        }
        left.cursor = 'pointer'
        bar.addChild(left)

        const right = new Graphics()
        right
            .moveTo(this.viewport.screenWidth -scrollBarSize - 1, scrollBarSize / 2)
            .lineTo(this.viewport.screenWidth - 1 - scrollBarSize * 2, 0)
            .lineTo(this.viewport.screenWidth - 1 - scrollBarSize * 2, scrollBarSize)
            .lineTo(this.viewport.screenWidth -scrollBarSize - 1, scrollBarSize / 2)
            .fill({
                color: scrollbarColor
            })
        right.interactive = true
        right.on('mouseenter', () => {
            right.fillStyle.color = scrollbarAtiveColor
            right.endFill()
        })
        right.on('mouseleave', () => {
            right.fillStyle.color = scrollbarColor
            right.endFill()
        })
        right.cursor = 'pointer'
        right.onclick = () => {
            this.viewport.x -= 100
            this.viewport.emit('wheel', {
                type: 'animate',
                deltaX: 100,
                deltaY: 0,
            } as unknown as FederatedWheelEvent)
        }

        bar.addChild(right)

        const thumb = new Graphics()
        thumb.roundRect(0, 0, this.getThumbSizeX(), scrollBarSize,scrollBarSize/2)
        
            .fill({
                color: scrollbarColor
            })
        thumb.x = this.getThumbPositionX()
        thumb.interactive = true
        thumb.cursor = 'pointer'

        thumb.on('mouseenter', () => {
            thumb.fillStyle.color = scrollbarAtiveColor
            thumb.endFill()
        })
        thumb.on('mouseleave', () => {
            thumb.fillStyle.color = scrollbarColor
            thumb.endFill()
        })
        this.thubmX = bar.addChild(thumb)
        this.scrollX = this.graph.app.stage.addChild(bar)
    }

    private getThumbSizeX() {
        const realWidth = this.viewport.screenWidth - scrollGap * 2 - 2 - scrollBarSize * 2
        const thumb = Math.min(this.viewport.screenWidth / this.viewport.worldWidth * realWidth, realWidth)
        return thumb
    }



    drawScrollBarY() {
        const bar = new Container({
            x: this.viewport.screenWidth - scrollBarSize - 1,
            y: 0,
            width: scrollBarSize,
            height: this.viewport.screenHeight
        })
        const up = new Graphics()

        up.moveTo(scrollBarSize / 2, 1)
            .lineTo(0, 1 + scrollBarSize)
            .lineTo(scrollBarSize, 1 + scrollBarSize)
            .lineTo(scrollBarSize / 2, 1)
            .fill({
                color: scrollbarColor
            })
        up.interactive = true
        up.on('mouseenter', () => {
            up.fillStyle.color = scrollbarAtiveColor
            up.endFill()
        })
        up.on('mouseleave', () => {
            up.fillStyle.color = scrollbarColor
            up.endFill()
        })

        up.onclick = () => {
            this.viewport.y += 100
            this.viewport.emit('wheel', {
                type: 'animate',
                deltaX: 0,
                deltaY: -100,
            } as unknown as FederatedWheelEvent)
        }

        up.cursor = 'pointer'
        bar.addChild(up)

        const down = new Graphics()
        down.moveTo(scrollBarSize / 2, this.viewport.screenHeight - scrollBarSize - 1)
            .lineTo(0, this.viewport.screenHeight - scrollBarSize * 2 - 1)
            .lineTo(scrollBarSize, this.viewport.screenHeight - scrollBarSize * 2 - 1)
            .lineTo(scrollBarSize / 2, this.viewport.screenHeight - scrollBarSize - 1)
            .fill({
                color: scrollbarColor
            })
        down.interactive = true
        down.on('mouseenter', () => {
            down.fillStyle.color = scrollbarAtiveColor
            down.endFill()
        })
        down.on('mouseleave', () => {
            down.fillStyle.color = scrollbarColor
            down.endFill()
        })

        down.onclick = () => {
            this.viewport.y -= 100
            this.viewport.emit('wheel', {
                type: 'animate',
                deltaX: 0,
                deltaY: 100,
            } as unknown as FederatedWheelEvent)
        }
        down.cursor = 'pointer'
        bar.addChild(down)
        const thumb = new Graphics()
        thumb.roundRect(0, 0, scrollBarSize, this.thumbSizeY,scrollBarSize/2)
            .fill({
                color: scrollbarColor
            })
        thumb.y = this.getThumbPositionY()
        thumb.interactive = true
        thumb.cursor = 'pointer'
        thumb.on('mouseenter', (e) => {
            thumb.fillStyle.color = scrollbarAtiveColor
            thumb.endFill()
        })
        thumb.on('mouseleave', (e) => {
            thumb.fillStyle.color = scrollbarColor
            thumb.endFill()
        })
        this.thubmY = bar.addChild(thumb)
        this.scrollY = this.graph.app.stage.addChild(bar)
    }
}