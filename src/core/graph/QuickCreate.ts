import { Container, DestroyOptions, Graphics } from "pixi.js";
import { RectWithStereotypeShape } from "../shapes/RectWithStereotypeShape";
import { Direction, GlobalStype } from "../shapes/GlobalStyle";
import { Graph, IQuickStart, IQuickStartMenu } from "./Graph";
import { Select } from "./components/Select";


export class QuickCreate extends Container {

    right?: Container

    left?: Container

    up?: Container

    down?: Container

    isHovering: boolean = false

    constructor(public tartgetShape: RectWithStereotypeShape,public graph: Graph) {
        super()
        this.tartgetShape.container.on('mouseenter', e => {
            this.show()
            console.log('shape enter')
        })
        this.tartgetShape.container.on('mouseleave', e => {
            this.hide()
            this.isHovering = false
        })
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options)
        this.hide()
    }

    show() {
        const directions = [Direction.left, Direction.right, Direction.top, Direction.bottom]
        let hasShow = false
        directions.forEach(dir => {
            const quickStart = this.tartgetShape.graph.getQuickStart(this.tartgetShape.id, dir);
            if (quickStart?.menus?.length) {
                this.createButtons(quickStart, dir)
                hasShow = true
            }
        })
        if (hasShow) {

        }
        return this
    }



    hide() {
        if (this.right) {
            this.tartgetShape.container.removeChild(this.right)
            this.right = undefined
        }
        if (this.left) {
            this.tartgetShape.container.removeChild(this.left)
            this.left = undefined
        }
        if (this.up) {
            this.tartgetShape.container.removeChild(this.up)
            this.up = undefined
        }
        if (this.down) {
            this.tartgetShape.container.removeChild(this.down)
            this.down = undefined
        }
    }

    createButtons(info: IQuickStart, direction: Direction,) {
        switch (direction) {
            case Direction.left:
                this.drawLeftArrowButton(info);
                break;
            case Direction.right:
                this.drawRightArrowButton(info);
                break;
            case Direction.top:
                this.drawUpArrowButton(info);
                break;
            case Direction.bottom:
                this.drawDownArrowButton(info);
                break;
        }
    }


    drawDownArrowButton(info: IQuickStart) {
        if (this.down) return
        const { width, height } = this.tartgetShape
        const button = new Container({
            x: 0,
            y: height,
        });
        const arrowArea = new Graphics();
        arrowArea.rect(0, 0, width, 56)
        button.addChild(arrowArea).fill({
            alpha: 0
        })
        const arrow = new Graphics();
        arrow.moveTo(width / 2 - 8, 6)
            .lineTo(width / 2 - 8, 30)
            .lineTo(width / 2 - 14, 30)
            .lineTo(width / 2, 52)
            .lineTo(width / 2 + 14, 30)
            .lineTo(width / 2 + 8, 30)
            .lineTo(width / 2 + 8, 6)
            .closePath()
            .fill({
                color: GlobalStype.QuickStartArrowFill,
                alpha: .15
            })
        arrow.interactive = true
        arrow.on('mouseenter', () => {
            arrow.fillStyle.alpha = 1
            arrow.endFill()
        })
        arrow.on('mouseleave', () => {
            arrow.fillStyle.alpha = .15
            arrow.endFill()
        })
        button.addChild(arrow)
        this.down = this.tartgetShape.container.addChild(button);

    }


    private drawUpArrowButton(info: IQuickStart) {
        if (this.up) return
        const { width } = this.tartgetShape
        const button = new Container({
            x: 0,
            y: 0
        });
        const arrowArea = new Graphics();
        arrowArea.rect(0, -56, width, 56)
        button.addChild(arrowArea).fill({
            alpha: 0
        })
        const arrow = new Graphics();
        arrow.moveTo(width / 2 - 8, -6)
            .lineTo(width / 2 - 8, -30)
            .lineTo(width / 2 - 14, -30)
            .lineTo(width / 2, -52)
            .lineTo(width / 2 + 14, -30)
            .lineTo(width / 2 + 8, -30)
            .lineTo(width / 2 + 8, -6)
            .closePath()
            .fill({
                color: GlobalStype.QuickStartArrowFill,
                alpha: .15
            })
        arrow.interactive = true
        arrow.on('mouseenter', () => {
            arrow.fillStyle.alpha = 1
            arrow.endFill()
        })
        arrow.on('mouseleave', () => {
            arrow.fillStyle.alpha = .15
            arrow.endFill()
        })
        button.addChild(arrow)
        this.up = this.tartgetShape.container.addChild(button);

    }


    private drawLeftArrowButton(info: IQuickStart) {
        if (this.left) return
        const { height } = this.tartgetShape
        const button = new Container({
            x: 0,
            y: 0,
        });
        const arrowArea = new Graphics();
        arrowArea.rect(-56, 0, 56, height)
        button.addChild(arrowArea).fill({
            alpha: 0
        })
        const arrow = new Graphics();
        arrow.moveTo(-6, height / 2 - 8)
            .lineTo(-30, height / 2 - 8)
            .lineTo(-30, height / 2 - 14)
            .lineTo(-52, height / 2)
            .lineTo(-30, height / 2 + 14)
            .lineTo(-30, height / 2 + 8)
            .lineTo(-6, height / 2 + 8)
            .lineTo(-6, height / 2 - 10)
            .closePath()
            .fill({
                color: GlobalStype.QuickStartArrowFill,
                alpha: .15
            })
        arrow.interactive = true
        arrow.on('mouseenter', () => {
            arrow.fillStyle.alpha = 1
            arrow.endFill()
        })
        arrow.on('mouseleave', () => {
            arrow.fillStyle.alpha = .15
            arrow.endFill()
        })
        button.addChild(arrow);
        this.left = this.tartgetShape.container.addChild(button);
    }


    createMenus(info: IQuickStart, arrow: Graphics) {
        const { menus, ...selectParams } = info
        const { height } = this.tartgetShape
        if (arrow.children.length) return
        const select = new Select({
            ...selectParams,
            options: menus.map(o => o.lineType)
        })
        select.show(arrow, height)
        select.onSelect = (v) => {
            console.log(v)
            this.hide()
            const info = this.graph.getPreview(v)
            // this.graph.quickCreateInfo = {
            //     lineKey: v
            // }
        }
    }


  private drawRightArrowButton(info: IQuickStart) {
        if (this.right) return
        const { width, height } = this.tartgetShape
        const button = new Container({
            x: width,
            y: 0,
        });
        const arrow = new Graphics();
        const arrowArea = new Graphics();
        arrowArea.rect(0, 0, 56, height)
        button.addChild(arrowArea).fill({
            alpha: 0
        })
        arrow.moveTo(6, height / 2 - 8)
            .lineTo(30, height / 2 - 8)
            .lineTo(30, height / 2 - 14)
            .lineTo(52, height / 2)
            .lineTo(30, height / 2 + 14)
            .lineTo(30, height / 2 + 8)
            .lineTo(6, height / 2 + 8)
            .lineTo(6, height / 2 - 8)
            .closePath()
            .fill({
                color: GlobalStype.QuickStartArrowFill,
                alpha: .15
            })

        arrow.interactive = true
        arrow.cursor = 'pointer';
        arrow.on('mouseenter', () => {
            arrow.fillStyle.alpha = 1
            arrow.endFill()
            this.isHovering = true
            this.createMenus(info, arrow)
            if(this.arrowTimer>=0){
                clearTimeout(this.arrowTimer)
            }

        })
        arrow.on('mouseleave', () => {
            arrow.fillStyle.alpha = .15
            arrow.endFill()

          this.arrowTimer =  setTimeout(() => {
                clearTimeout(this.arrowTimer)
                this.arrowTimer = -1
                const select = arrow.children[0] as Select
                select?.hide()
            }, 100);
        })


        button.addChild(arrow);
        this.right = this.tartgetShape.container.addChild(button);
    }

    private arrowTimer: number = -1


}