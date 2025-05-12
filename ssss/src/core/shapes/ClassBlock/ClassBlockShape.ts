import { RectWithStereotypeShape } from "../RectWithStereotypeShape";
import { IAttrGroup } from "./type";
import { AttrGroup } from "../Attr/attrGroup";
import { Container } from "../Container";


export class ClassBlockShape extends RectWithStereotypeShape {
    attrGroups?: IAttrGroup[] = [{
        type: 'standard',
        title: '组成部分属性',
        attrs: [
            //     {

            //     id: "1",
            //     label: '属性1',
            //     type: '模块1',
            //     multiplicity: '1..1'
            // },
            // {
            //     id: "2",
            //     label: '属性2',
            //     type: '模块1',
            //     multiplicity: '1..1'
            // },
            {
                id: "3",
                prefix: '«signal»',
                label: '倒萨倒萨倒萨倒萨倒萨倒萨大撒大撒大撒大撒大撒大撒大撒大撒大撒',
                // params: [{id:'1',label:'参数1',},{id:'2',label:'参数2',}],
                sender: '模块_1',
                // paramsBreackets: ['(',')'],
                messaureOperator: '>>',
                messaureUnit: 'dsadasdsadsads',
                messaureValue: '123'
            }
        ]
    }]

    attrGroupHead?: AttrGroup

    renderEntry() {
        super.renderEntry()
        this.drawAttrs()

    }

    private drawAttrs() {
        this.attrGroupHead = undefined
        let prev: AttrGroup | undefined
        const GroupContainer = new Container()
        GroupContainer._width = this.width
        GroupContainer.x = 0
        GroupContainer.y =  this.headerHeight
        this.attrGroups?.forEach(item => {
            const group = new AttrGroup(GroupContainer, item, this.graph?.app!)
            if (prev) {
                prev.next = group
                group.prev = prev
            } else {
                this.attrGroupHead = group
            }
            prev = group
        })
        this.container.addChild(GroupContainer)
    }
}