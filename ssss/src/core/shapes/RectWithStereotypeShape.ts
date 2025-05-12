import { Graphics, Text, TextStyle } from "pixi.js";
import { SEBaseShape, ShapeConfig } from "./SEBaseShape";
import { GlobalStype } from "./GlobalStyle";
import { Container } from "./Container";
import { QuickCreate } from "../graph/QuickCreate";

export class RectWithStereotypeShape extends SEBaseShape<ShapeConfig> {
    /** 坐标x */
    x: number = 100;
    /** 坐标y */
    y: number = 100;
    /** 宽度 */
    width: number = 200;
    /** 高度 */
    height: number = 200;
    /** 最小宽度 */
    minWidth: number = 0;
    /** 最小高度 */
    minHeight: number = 0;
    /** 最大宽度 */
    maxWidth: number = 0;
    /** 最大高度 */
    maxHeight: number = 0;

    /** 是否等比缩放 */
    isRatioResize?: boolean;
    /** 构造型 */
    stereotype?: string = '模块';
    /** 构造型是否显示 */
    stereotypeVisible?: boolean = true;

    title: string = '电力系统电力'

    headerHeight: number = 54

    headerFontSize: number = 20

    maxLines: number = 2

    selectedable: boolean = true

    mouveable: boolean = true
  


    override created(): void {
        this.graph.app.stage.eventMode = 'static';
        this.graph.app.stage.hitArea = this.graph.app.screen;
        this.graph.app.stage.on('pointerup', this.onDragEnd.bind(this))
        this.graph.app.stage.on('pointerupoutside', this.onDragEnd.bind(this))
    }


    drawSterotype() {
        if (!this.stereotypeVisible || !this.stereotype) return
        const style = new TextStyle({
            fontSize: GlobalStype.StereotypeFontSize,
            fill: { color: GlobalStype.fontColor },
        });
        const text = `«${this.stereotype}»`;
        const stereotype = new Text({
            text,
            style,
            x: (this.width - text.length * GlobalStype.StereotypeFontSize) / 2,
            y: GlobalStype.ContentPadding
        });
        this.container.addChild(stereotype)
    }

    dragStartPosition?: { x: number, y: number }

    onDragStart(e: any) {
        e.stopPropagation()
        const newPoistion = this.container.parent.toLocal(e.global)
        this.dragStartPosition = {
            x: newPoistion.x - this.x,
            y: newPoistion.y - this.y
        }
        this.graph.app.stage.on('pointermove', this.onDragMove.bind(this))
    }

    onDragMove(event: any) {

        // console.log(event, 'onDragMove')
        if (!this.dragStartPosition) return
        const newPoistion = this.container.parent.toLocal(event.global)
        this.container.x = newPoistion.x - this.dragStartPosition.x
        this.container.y = newPoistion.y - this.dragStartPosition.y
        this.x = this.container.x
        this.y = this.container.y
        // this.app.stage.scrollToPosition({x: this.x,y: this.y+200})
    }

    onDragEnd() {
        if (!this.dragStartPosition) return
        this.graph.app.stage.off('pointermove', this.onDragMove.bind(this))
        this.dragStartPosition = undefined


    }




    renderEntry() {
        // const container = new Container({
        //     x: this.x,
        //     y: this.y,
        //     width: this.width,
        //     height: this.height,
        // })
        // container.interactive = true
        // const graphics = new Graphics();
        // container.addChild(graphics)
        // graphics.rect(0, 0, this.width, this.height);
        // graphics.fill({
        //     color: '#fff'
        // })
        // graphics.stroke({ width: GlobalStype.strokeWidth, color: GlobalStype.strokeColor });
        // graphics.interactive = true;
        // graphics.eventMode = 'static'


        // graphics.on('clickcapture', (e) => {
        //     if (!this.selectedable) return
        //     graphics.setStrokeStyle({ color: '#ff0000' })
        //     graphics.endFill()
        // })
        // this.container = container;
        // // this.graph.quickCreateInstance = new QuickCreate(this)
        // graphics.cursor = 'pointer';


        // Center the bunny's anchor point

        // Make it a bit bigger, so it's easier to grab
        // graphics.scale.set(3);
        // graphics.on('pointerdown', this.onDragStart.bind(this), graphics)
        // this.drawHeader()
    }



    private getHeaderTextStartPosition() {
        const textWidth = this.title.length * this.headerFontSize
        const textTotalWidth = textWidth + GlobalStype.ContentPadding * 2
        let offsetX = 0;
        let offsetY = GlobalStype.ContentPadding
        let textContent = this.title
        if (this.stereotype && this.stereotypeVisible) {
            offsetY = GlobalStype.ContentPadding * 1.5 + GlobalStype.StereotypeFontSize
        }
        if (textTotalWidth > this.width) {
            // 文字宽度比图形宽度大，需要换行或者截取
            offsetX = GlobalStype.ContentPadding
            const rowCount = Math.ceil((this.width - GlobalStype.ContentPadding * 2) / this.headerFontSize)
            const countWidth = rowCount * this.headerFontSize
            offsetX = (this.width - countWidth) / 2 + GlobalStype.ContentPadding
            const sliceLength = this.maxLines * rowCount

            textContent = this.title.slice(0, sliceLength - 3) + '...'
        } else {
            // 文字宽度比图形宽度小，直接绘制
            offsetX = (this.width - textWidth) / 2
        }

        return {
            offsetX,
            offsetY,
            textContent
        }
    }

    drawHeader() {
        const { offsetX, offsetY, textContent } = this.getHeaderTextStartPosition()
        const style = new TextStyle({
            fontSize: this.headerFontSize,
            fill: { color: GlobalStype.fontColor },
            wordWrap: true,
            wordWrapWidth: this.width - GlobalStype.ContentPadding * 2,
            breakWords: true
        });

        const basicText = new Text({
            text: textContent,
            style
        });
        basicText.x = offsetX;
        basicText.y = offsetY;
        const graphics = new Graphics();
        graphics.rect(0, 1, this.width - 1, this.headerHeight - 1).fill({
            color: '#fff'
        })
        graphics.moveTo(0, this.headerHeight)
            .lineTo(this.width, this.headerHeight)
            .stroke({
                color: '#f00',
                pixelLine: true
            })
        this.container.addChild(graphics)
        this.container.addChild(basicText)
        this.drawSterotype()
    }



}