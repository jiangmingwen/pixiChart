图形
block
- [ ] ellipse
- [ ] image
- [ ] path
- [ ] polygon
- [ ] rect
- [ ] star
- [ ] text
- [ ] state
- [ ] swimlne
- [ ] lifeline


lines
- [ ] 折线/直线
- [ ] 自动躲避障碍?
- [ ] 线形：支持注册自定义
- [ ] 箭头：支持注册自定义
- [ ] 动态连接线


交互
- [ ] 嵌套：

  - [ ] 嵌套高亮示意
  - [ ] 预留嵌套自定义校验

- [ ] 连线:  

  - [ ] 没有提供连接点，自动计算最优连接点（最短路径算法？）
  - [ ] 线的连接点可调整
  - [ ] 线的标题可以移动
  - [ ] 线的折点可以移动
  - [ ] 线支持多个标题
  - [ ] 线交叉是否需要处理样式
  - [ ] 移动线的折点时，需要保持线的两端垂直于图元

- [ ] 分组

- [ ] 分栏：

  - [ ] 可以自定义拖拽点、以及拖拽点的样式

- [ ] 缩放

  - [ ] 缩放限制、最大、最小、宽高等比缩放
  - [ ] 放大缩小图元/视图、多选缩放

- [ ] undo/redo ？

- [ ] 拖拽

- [ ] 平移

- [ ] 选中和高亮  
  - [ ] 框选

- [ ] 对齐和吸附

- [ ] 边界：嵌套图元，子图元限制移出父图元

- [ ] 层级

- [ ] 编辑
- [ ] 画布滚动

  - [ ] 直接编辑 
  - [ ] 图元快捷创建

- [ ] 支持图标icon渲染，同时支持点击事件

- [ ] ？？图元的属性能支持控制能否移动、缩放、圆角、自动扩展、约束子图元、标题换行、省略号、文本图元根据文本自适应高度、重叠检测、禁用交互事件、锁定图元、画布锁定、图元旋转（常用角度吸附）、标题大小、颜色、填充色、透明修改、支持背景设置图片、自动布局忽略属性、作战单位的属性实现？嵌套时的安全距离、泳道的分栏的特殊缩放、泳道支持垂直、水平

  

  

布局
- [ ] 自动布局：支持自定义注册新的布局
- [ ] 手动布局

框架
- [ ] 插件式: 功能插件、图形插件
- [ ] 更新机制：支持事务批量更新、是否能支持更新前拿到数据的改变
- [ ] 性能：可视区域？导出？
- [ ] 事件系统
  - [ ] 内部提供各种事件的监听口子
  - [ ] 提供发布订阅机制用于通信
- [ ] 快捷键
  - [ ] shift 水平、垂直、对角线移动





  /**
   图元分组功能
   
  const container = new Container();
  container.x = 100
  container. y = 100

  const graphics = new Graphics();
  graphics.rect(0, 0, 200, 200);
  graphics.stroke(0xff0000);

  const graphics2= new Graphics();

  graphics2.rect(10, 10, 100, 100);
  graphics2.stroke(0x650a5a);

  graphics.addChild(graphics2);

  container.addChild(graphics)



  const graphics3 = new Graphics();
  graphics3.rect(10, 110, 100, 100);
  graphics3.stroke(0x0000ff);
  app.app.stage.addChild(graphics3);

  app.app.stage.addChild(container);

  
  
   */