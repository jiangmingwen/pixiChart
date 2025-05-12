import { Container, Graphics, Ticker } from "pixi.js";
import { GraphPlugin } from "./plugin";
import { GlobalStype } from "../../shapes/GlobalStyle";

export class LoadingShapePlugin extends GraphPlugin {

    private loadingShape?: Container

    private loadingCallback?: (time: Ticker) => void

    private loadingColor: string = GlobalStype.LoadingColor

    private loadingWidth: number = GlobalStype.LoadingStrokeWidth

    private loadingSpeed: number = GlobalStype.LoadingSpeed

    private loadingShapes: Map<string, Container> = new Map()

    get isLoading() {
        return !!this.loadingShape
    }

    update() {
        if (!this.isLoading) return
        this.showLoading()
    }


    show(shapeId: string,){

    }

    /**
     * 展示loading
     * @param color loading的颜色
     * @param width loading的线宽
     * @param speed loading的速度 tips： 一般设为1/6 较为理想
     */
    showLoading(color?: string, width?: number, speed?: number) {
        // if(color) {
        //     this.loadingColor = color
        // }
        // if(width){
        //     this.loadingWidth =width
        // }
        // if(speed){
        //     this.loadingSpeed = speed
        // }
        // if (this.loadingShape) this.hideLoading()
        // const container = new Container({ x: 0, y: 0 });
        // const halfCircle = new Graphics().arc(0, 0, this.shape.options.width, 0, Math.PI).fill({ color: 0x000000, alpha: 1 });
        // halfCircle.position.set(this.shape.options.width / 2, this.shape.options.height / 2);
        // const rectangle = new Graphics().rect(0, 0, this.shape.options.width, this.shape.options.height).stroke({ width:  this.loadingWidth, color:this.loadingColor });
        // rectangle.mask = halfCircle;
        // container.addChild(rectangle);
        // container.addChild(halfCircle);
        // let phase = Math.random() * 10
        // this.loadingShape = this.shape.addChild(container);


        // this.loadingCallback = (ticker: Ticker) => {
        //     // Update phase

        //     phase += ticker.deltaTime * this.loadingSpeed
        //     phase %= Math.PI * 2;
        //     halfCircle.rotation = phase;
        // };
        // this.shape.graph.app.ticker.add(this.loadingCallback);
    };
    /** 隐藏loading */
    hideLoading() {
        // if (!this.loadingShape) return
        // this.shape.removeChild(this.loadingShape)
        // if (this.loadingCallback) {
        //     this.shape.graph.app.ticker.remove(this.loadingCallback);
        // }
        // this.loadingCallback = undefined
        // this.loadingShape = undefined
    }

    init(): void {

    }

    destroy(): void {
        this.hideLoading()
    }

}

/** loading样式 */
export interface ILoadingStyle  {
    /** loading的颜色 */
    color?: string
    /** loading的速度 tips： 一般设为1/6 较为理想 */
    speed?: number
    /** loading的线宽 */
    width?: number
}