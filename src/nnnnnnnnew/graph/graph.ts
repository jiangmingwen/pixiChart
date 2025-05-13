import type { ApplicationOptions } from "pixi.js"
import { Application, } from "pixi.js"
import { GlobalStyle } from "../config/globalStyle"
import { SystemEvent } from "../events/systemEvent"
import { ActiveShapePlugin } from "../interactions/active/activePlugin"
import { ConnectionPlugin } from "../interactions/connection/connectionPlugin"
import { DragPlugin } from "../interactions/drag/dragPlugin"
import { HignlightPlugin } from "../interactions/hignlight/hignlightPlugin"
import { SEContainer } from "../pixiOverrides/container"
import { BlockShape } from "../shapes/blocks/blockShape"
import { LineShape } from "../shapes/lines/lineShape"
import type { IClassBlockShape, IPointData } from "../type"
import { ScrollView } from "./scrollView"
import type { IBlockData, IGraphOptions, IInteractions, ILineData } from "./type"


/** 结构性视图 */
export class Graph {
    /** 视图id */
    readonly id: string
    /** pixi.js 实例 */
    readonly app: Application
    /** 滚动画布 */
    readonly scrollView!: ScrollView
    /** canvas挂载的根节点 */
    readonly root: HTMLElement
    /** 视图宽 */
    width: number
    /** 视图高  */
    height: number
    /** 画布的缩放比例下限 */
    minScale = 0.3
    /** 画布 的缩放比例上限 */
    maxScale = 5

    interactions!: IInteractions

    events!: SystemEvent

    /** 画布的缩放比例 */
    get scale() {
        return Number(this.scrollView.scale.x.toFixed(2))
    }

    readonly idMapBlocks: Map<string, BlockShape> = new Map()
    readonly idMapLines: Map<string, LineShape> = new Map()

    constructor({ width, height, el, id }: IGraphOptions) {
        this.app = new Application()
        this.root = el
        this.width = width
        this.height = height
        this.id = id

    }
    /**
     *  获取某个坐标点的图元 
     * @param x globalX
     * @param y globalY
     * @param direct 是否直接获取  {@default false}
     * @returns 坐标点上的图元
     */
    hitTest(x: number, y: number, direct?: boolean) {
        let shape: BlockShape | undefined = this.app.renderer.events.rootBoundary.hitTest(x, y) as BlockShape
        if (direct === true) return shape;
        while (shape) {
            if (!(shape instanceof BlockShape)) {
                shape = (shape as SEContainer).parent as BlockShape
            } else {
                return shape
            }
        }
    }

    /**
     * 获取窗口坐标下的图元
     * @param clientX clientX
     * @param clientY clientY
     * @returns 
     */
    hitTestByClientPosition(clientX: number, clientY: number) {
        const { globalX, globalY } = this.covertClientPositionToGlobalPosition(clientX, clientY)
        return this.hitTest(globalX, globalY)
    }
    /**  获取 窗口坐标下相对于指定父图元的相对坐标
     *  @param clientPosition 窗口坐标
     *  @param parentId 父图元id
     */
    getRelativePosition(clientPosition: { clientX: number, clientY: number }, parentId?: string): IPointData {
        const globalPosition = this.covertClientPositionToGlobalPosition(clientPosition.clientX, clientPosition.clientY)
        if (!parentId) return {
            x: globalPosition.globalX,
            y: globalPosition.globalY
        }
        const shape = this.getShapeById(parentId)
        if (!shape) return {
            x: globalPosition.globalX,
            y: globalPosition.globalY
        }
        const parentAbs = this.interactions.connection.getAbsolutePosition(shape)
        return {
            x: globalPosition.globalX - parentAbs.x,
            y: globalPosition.globalY - parentAbs.y
        }
    }

    preParentSort(blocks: IBlockData[]): IBlockData[] {
        // 1. 构建映射
        const blockMap = new Map<string, IBlockData>();       // ID → Block
        const childrenMap = new Map<string, IBlockData[]>();  // ParentID → Children
        const roots: IBlockData[] = [];                       // 根节点列表
        // 第一次遍历：初始化所有节点和子节点列表
        for (const block of blocks) {
            blockMap.set(block.id, block);
            childrenMap.set(block.id, []);
        }
        // 第二次遍历：填充子节点列表并收集根节点
        for (const block of blocks) {
            const parentId = block.parentId;
            if (!!parentId && blockMap.has(parentId)) {
                // 父节点存在，添加到父节点的子列表
                childrenMap.get(parentId)!.push(block);
            } else {
                // 父节点不存在或为 null，作为根节点
                roots.push(block);
            }
        }

        // 3. 广度优先遍历生成排序结果
        const result: IBlockData[] = [];
        const queue: IBlockData[] = [...roots];  // 使用队列实现广度优先遍历

        while (queue.length > 0) {
            const current = queue.shift()!;
            result.push(current);
            // 将子节点按顺序加入队列末尾
            const children = childrenMap.get(current.id)!;
            for (const child of children) {
                queue.push(child);
            }
        }

        return result;
    }

    /** 转换窗口坐标为画布全局坐标
     * @param clientX clientX
     * @param clientY clientY
     */
    covertClientPositionToGlobalPosition(clientX: number, clientY: number) {
        const globalX = clientX - this.root.offsetLeft
        const globalY = clientY - this.root.offsetTop
        return { globalX, globalY }
    }

    updateData(blocks: IBlockData[], lines: ILineData[]) {
        const sortedBlocks = this.preParentSort(blocks)
        sortedBlocks.forEach(block => {
            const shape = this.createShape(block)
            const parentShape = this.idMapBlocks.get(block.parentId ?? '')
            this.addChild(shape, parentShape)
        })
    }

    getShapeById(id: number | string) {
        return this.idMapBlocks.get(id as string)
    }

    addChild(shape: BlockShape, parent?: BlockShape) {
        if (parent) {
            parent.addChild(shape)
        } else {
            this.scrollView.add(shape)
        }
        this.idMapBlocks.set(shape.id, shape)
    }

    removeChild(shape: any, parent?: any) {
        if (parent) {
            parent.removeChild(shape)
        } else {
            this.scrollView.removeChild(shape)
        }
        this.idMapBlocks.delete(shape.uid)
    }

    addLine(shape: any) {
        this.scrollView.add(shape)
        this.idMapLines.set(shape.uid, shape)
    }

    removeLine(shape: any) {
        const line = this.idMapLines.get(shape.uid)
        if (!line) return
        this.scrollView.removeChild(line as any)
        this.idMapLines.delete(shape.uid)
    }

    async init(options?: Partial<ApplicationOptions>) {
        await this.app.init(Object.assign(options ?? {}, { antialias: true }))
        this.root.appendChild(this.app.canvas)
        this.app.stage.interactive = true
        //@ts-ignore
        this.scrollView = new ScrollView({
            graph: this,
            diagramHeight: this.height,
            diagramWidth: this.width
        })
        this.events = new SystemEvent(this)
        this.interactions = {
            connection: new ConnectionPlugin(this),
            active: new ActiveShapePlugin(this),
            drag: new DragPlugin(this),
            hignlight: new HignlightPlugin(this)
        }
    }

    /** 创建shape */
    createShape<T extends BlockShape = any>(config: IBlockData) {
        const GraphicClass = Graph.graphicTypes.get(config.graphType);
        if (!GraphicClass) throw new Error(`Unregistered graphic type: ${config.graphType}`);
        //@ts-ignore
        const shape = new GraphicClass(this, config) as unknown as T; // 默认抽象类已经都实现
        return shape
    }

    /** 导出图片 */
    exportImg() {

    }

    getShapesByPosition(x: number, y: number) {
        this.idMapBlocks
    }

    /** 获取父shape */
    getParentShape(shapeId: string): undefined | BlockShape {
        const shape = this.getShapeById(shapeId)
        if (!shape || !shape.parentId) return undefined
        return this.getShapeById(shape.parentId)
    }

    // quickCreateInstance?: QuickCreate
    // quickCreateInfo?: IQuickCreateInfo


    /** 已注册的图形存放库 */
    private static graphicTypes: Map<string, typeof BlockShape> = new Map();
    /**
     * 注册图形方法
     * @param shape 注册的图形 shape | shape[]
     * @returns 
     */
    static registerShape(shape: IClassBlockShape | IClassBlockShape[]) {
        if (Array.isArray(shape)) {
            shape.forEach(this.__registrerShape.bind(this))
        } else {
            this.__registrerShape(shape)
        }
        return this
    }
    /**
     * 
     * @param shape 注册单个图形方法
     * @returns 
     */
    private static __registrerShape<T extends IClassBlockShape>(shape: T) {
        if (this.graphicTypes.has(shape.shapeType)) throw new Error(`Shape has already been registered: ${shape.shapeType}`);
        this.graphicTypes.set(shape.shapeType, shape);
        return this
    }

    /** 获取离屏canvas dom */
    static getOffScreenElement() {
        const id = 'pixi-offscreen'
        let canvas = document.getElementById(id)
        if (canvas) return canvas as HTMLCanvasElement
        canvas = document.createElement('canvas')
        canvas.id = id
        document.body.appendChild(canvas)
        return canvas as HTMLCanvasElement
    }

    /** 设置主题 */
    static setTheme(theme: Partial<typeof GlobalStyle>) {
        Object.assign(GlobalStyle, theme)

    }

    /** 获取类 */
    static getClassShape<T extends IClassBlockShape>(shapeType: string): T {
        return this.graphicTypes.get(shapeType) as T
    }

}