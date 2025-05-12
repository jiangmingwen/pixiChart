import './index.css'
import { Graph } from './nnnnnnnnew/graph/graph';
import { RectWithAttrBlockShape } from './nnnnnnnnew/shapes/blocks/rectWithAttr/rectWithAttrBlockShape';
import { RectWithHeaderBlockShape } from './nnnnnnnnew/shapes/blocks/rectWithHeader/rectWithHeaderBlockShape';
import { RectBlockShape } from './nnnnnnnnew/shapes/blocks/rect/rectBlockShape';
// import { Graph } from './core/graph/Graph';
// import { ClassBlockShape } from './core/graph/shape/blocks/classBlockShape';

(async () => {
  const dom = document.getElementById("pixi-container")!

  Graph.registerShape([RectWithAttrBlockShape, RectWithHeaderBlockShape, RectBlockShape])


  console.log(RectWithHeaderBlockShape.name,'xxx')

  const app = new Graph({
    el: dom,
    width: 2000,
    height: 2000,
    id: '视图id'
  });
  await app.init({
    backgroundColor: 0xffffff,
    resizeTo: dom,
  });



  app.updateData([
    {
      id: '1112345',
      x: 240,
      y: 120,
      width: 100,
      height: 50,
      zIndex: 1,
      graphType: RectBlockShape.shapeType,
      label: '事件1_1',
      stereotype: '事件',
      stereotypeVisible: true

    },
    {
      id: '112345',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      zIndex: 1,
      graphType: RectWithHeaderBlockShape.shapeType,
      label: '包_1',
      stereotype: 'Package',
      stereotypeVisible: false

    },
    {
      id: '12345',
      x: 50,
      y: 20,
      width: 100,
      height: 100,
      zIndex: 1,
      graphType: RectWithAttrBlockShape.shapeType,
      parentId: '1234',

    }, {
      id: '1234',
      x: 300,
      y: 300,
      width: 200,
      height: 200,
      zIndex: 2,
      graphType: RectWithAttrBlockShape.shapeType,
    },
    {
      id: '12346',
      x: 500,
      y: 100,
      width: 200,
      height: 200,
      zIndex: 2,
      graphType: RectWithAttrBlockShape.shapeType,
    }
  ], [])


  const button = document.createElement('button')
  button.innerText = '选择连线'
  button.onclick = () => {
    app.interactions.connection.ready('lineS')

  }

  // const button1 = document.createElement('button')
  // button1.innerText = '拖拽图元'
  // button1.onmousedown = () => {
  //   app.interactions.drag.setDragGraphType(RectBlockShape.shapeType)

  // }

  document.getElementById('ppp')?.appendChild(button)
  // document.getElementById('ppp')?.appendChild(button1)

})();

