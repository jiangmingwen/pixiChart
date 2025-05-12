import { Application, ApplicationOptions } from "pixi.js";
import { ScrollView } from "./ScrollView";
import { SEBaseShape } from "../shapes/SEBaseShape";
import { GlobalStype } from "../shapes/GlobalStyle";
import { IEditSelectOptions, IOptions } from "./components/Select";
import { QuickCreate } from "./QuickCreate";
import { BaseBlockShape } from "./shape/BaseBlockShape";
import { ClassType, IBlockShape } from "./shape/type";
import { ActiveShapePlugin } from "./shape/ActiveShapePlugin";
import { DragShapePlugin } from "./shape/DragShapePlugin"
import { Connection } from "./shape/connection";
import { Hignlight } from "./shape/hignlightPlugin";
import { SEContainer } from "./override/container";
import { ILineShape } from "./shape/lines/LineShape";
import { SystemEvent } from "./SystemEvent";



export interface IGraphOptions {
    /** 视图的宽 */
    width: number
    /** 视图的高 */
    height: number
    /** 画布挂载的根元素 */
    el: HTMLElement
    /** 视图id */
    id: string
}


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

    connection!: Connection

    hignlight!: Hignlight

    drag!: DragShapePlugin

    active!: ActiveShapePlugin

    events!: SystemEvent

    /** 画布的缩放比例 */
    get scale() {
        return Number(this.scrollView.scale.x.toFixed(2))
    }

    readonly idMapBlocks: Map<string, BaseBlockShape> = new Map()
    readonly idMapLines: Map<string, SEBaseShape> = new Map()

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
        let shape: BaseBlockShape | undefined = this.app.renderer.events.rootBoundary.hitTest(x, y) as BaseBlockShape
        if (direct === true) return shape;
        while (shape) {
            if (!(shape instanceof BaseBlockShape)) {
                shape = (shape as SEContainer).parent as BaseBlockShape
            } else {
                return shape
            }
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



    updateData(blocks: IBlockData[], lines: IBlockData[]) {
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

    addChild(shape: BaseBlockShape, parent?: BaseBlockShape) {
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
        this.connection = new Connection(this)
        this.active = new ActiveShapePlugin(this)
        this.drag = new DragShapePlugin(this)
        this.hignlight = new Hignlight(this)
    }

    /** 创建shape */
    createShape<T extends BaseBlockShape = any>(config: IBlockData) {
        const GraphicClass = Graph.graphicTypes.get(config.graphType);
        if (!GraphicClass) throw new Error(`Unregistered graphic type: ${config.graphType}`);
        const shape = new GraphicClass(this, config) as unknown as T;
        return shape
    }

    /** 导出图片 */
    exportImg() {

    }

    getShapesByPosition(x: number, y: number) {
        this.idMapBlocks
    }

    /** 获取父shape */
    getParentShape(shapeId: string): undefined | BaseBlockShape {
        const shape = this.getShapeById(shapeId)
        if(!shape || !shape.parentId) return undefined
        return this.getShapeById(shape.parentId)
    }

    quickCreateInstance?: QuickCreate
    quickCreateInfo?: IQuickCreateInfo


    /** 已注册的图形存放库 */
    private static graphicTypes: Map<string, ClassType<BaseBlockShape>> = new Map();
    /**
     * 注册图形方法
     * @param shape 注册的图形 shape | shape[]
     * @returns 
     */
    static registerShape(shape: ClassType<BaseBlockShape> | (ClassType<BaseBlockShape>)[]) {
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
    private static __registrerShape(shape: ClassType<BaseBlockShape>) {
        if (this.graphicTypes.has(shape.name)) throw new Error(`Shape has already been registered: ${shape.name}`);
        this.graphicTypes.set(shape.name, shape);
        return this
    }

    /** 获取离屏canvas dom */
    static getOffScreenElement()  {
        const id = 'pixi-offscreen'
        let canvas = document.getElementById(id)
        if (canvas) return canvas as HTMLCanvasElement
        canvas = document.createElement('canvas')
        canvas.id = id
        document.body.appendChild(canvas)
        return canvas as HTMLCanvasElement
    }

    /** 设置主题 */
    static setTheme(theme: Partial<typeof GlobalStype>) {
        Object.assign(GlobalStype,theme)
    }
}




export interface IQuickCreateInfo {
    lineKey: string
    blockKey: string
}

export interface IPreview {
    graphType: string
    defaultWidth: number
    defaultHeight: number
    title?: string
    stereotype?: string
}


export interface IQuickStartMenu {
    lineType: IOptions
    blockTypes: IOptions[]
}

export interface IQuickStart extends IEditSelectOptions {
    menus: IQuickStartMenu[]
}


export interface IGraphExternalCallback {
    getPreview: (key: string) => IPreview | void | undefined


}



// export interface ILinkNode {
//     shape: BaseBlockShape
//     child?: ILinkNode
//     sibling?: ILinkNode
//     parent?: ILinkNode
// }


// 首先是shape的类型，包含了父级，孩子

// shape 可以找到子节点   子节点可以找到父节点

// 更新数据的类型
export interface IBlockData extends IBlockShape {
    graphType: string
}

export interface ILineData extends ILineShape {
    graphType: string
}