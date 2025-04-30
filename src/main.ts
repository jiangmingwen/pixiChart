import './index.css'
import { Graph } from './core/graph/Graph';
import { ClassBlockShape } from './core/graph/shape/blocks/classBlockShape';

(async () => {
  const dom = document.getElementById("pixi-container")!

  Graph.registerShape([ ClassBlockShape])

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
      id: '12345',
      x: 50,
      y: 20,
      width: 100,
      height: 100,
      zIndex: 1,
      graphType: ClassBlockShape.name,
      parentId: '1234',

    }, {
      id: '1234',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      zIndex: 2,
      graphType: ClassBlockShape.name,
    },
    {
      id: '12346',
      x: 500,
      y: 100,
      width: 200,
      height: 200,
      zIndex: 2,
      graphType: ClassBlockShape.name,
      fillColor: '#f1f100',
    }
  ], [])

  

  // app.getPreview = ()=> {
  //   return {
  //     graphType: ClassBlockShape.name,
  //     defaultHeight: 200,
  //     defaultWidth: 200,
  //     stereotype: 'xxxx',
  //     title: '模块'
  //   }
  // }

  // new BaseBlockShape(app,{
  //   id: '1234',
  //   x: 500,
  //   y: 500,
  //   width: 200,
  //   height: 200,
  // })

  // const s = new BaseBlockShape(app,{
  //   id: '12345',
  //   x: 500,
  //   y: 200,
  //   width: 100,
  //   height: 100
  // })
  // // 设置图形loading
  // // s.loading.showLoading('red',5)


  // new BaseBlockShape(app,{
  //   id: '123',
  //   x: 380,
  //   y: 330,
  //   width: 100,
  //   minHeight: 80,
  //   maxHeight: 300,
  //   minWidth: 100,
  //   maxWidth: 400,
  //   height: 100,
  //   fillColor: '#fff000',
  //   fillBgImg: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
  // })





  // rect.pixiObject.onclick = (e)=>{
  //   console.log(e,'e')
  //   circle.pixiObject.x += 100;
  // }

  // const shape = app.createShape({
  //   radius: 30,
  //   color: 0xff0000,
  //   x: 180,
  //   y: 100,
  //   graphicType: ClassBlockShape.name,
  // });
  // const graphics = new Graphics();
  // graphics.rect(180, 330, 100, 100);
  // graphics.stroke(0xff002f);
  // app.app.stage.addChild(graphics)

  //   const container = new Container();
  //   container.x = 100
  //   container. y = 100

  // const graphics = new Graphics();
  // graphics.rect(0, 0, 200, 200);
  // graphics.stroke(0xff0000);

  //   const graphics2= new Graphics();

  //   graphics2.rect(10, 10, 100, 100);
  //   graphics2.stroke(0x650a5a);

  //   graphics.addChild(graphics2);

  //   container.addChild(graphics)

  // console.log(graphics.parent)
  // console.log(graphics2.parent)

  //   const graphics3 = new Graphics();
  //   graphics3.rect(10, 110, 100, 100);
  //   graphics3.stroke(0x0000ff);
  //   app.app.stage.addChild(graphics3);

  //   app.app.stage.addChild(container);

  // app.addChild(block);



  // // 添加到舞台
  // app.addChild(circle);
  // app.addChild(rect);


  // 使用插件扩展的方法
  // const randomCircle = app.createRandomCircle();

  // 运行动画
  // app.app.ticker.add(() => {
  //   app.emit('update'); // 触发插件更新
  // });
})();

