import { useEffect, useRef } from 'react'
import { v7 } from 'uuid'
import './App.css'
import { DrawTool } from './DrawTool'
import type { IBlockData, ILineData } from './nnnnnnnnew/graph/type'
import type { IConnectData } from './nnnnnnnnew/interactions/connection/type'
import { RectBlockShape } from './nnnnnnnnew/shapes/blocks/rect/rectBlockShape'
import { RectWithAttrBlockShape } from './nnnnnnnnew/shapes/blocks/rectWithAttr/rectWithAttrBlockShape'
import { RectWithHeaderBlockShape } from './nnnnnnnnew/shapes/blocks/rectWithHeader/rectWithHeaderBlockShape'
import type { IPointData } from './nnnnnnnnew/type'
import type { IReactPixichartInstance } from './reactPixichart'
import type { IDragData } from './reactPixichart/dragDrop/type'
import { ReactPixiChart } from './reactPixichart/reactPixichart'


function createBlockData(data: IDragData, position: IPointData, parentId?: string) {
  const blockData: IBlockData = {
    id: v7(),
    x: position.x,
    y: position.y,
    width: 120,
    height: 60,
    zIndex: 1,
    graphType: data.graphType,
    label: data.key,
    stereotype: data.key,
    stereotypeVisible: true
  }
  if (parentId) {
    blockData.parentId = parentId
  }
  return blockData
}


function createLineData(data: IConnectData) {
  const lineData: ILineData = {
    id: v7(),
    sourceId: data.sourceId,
    entryX: data.entryX,
    entryY: data.entryY,
    exitX: data.exitX,
    exitY: data.exitY,
    graphType: data.elementType,
    targetId: data.targetId
  }
  console.log(JSON.stringify(lineData))
  return lineData
}



function App() {
  const graphRef = useRef<IReactPixichartInstance>(null)

  useEffect(() => {
    const blocks = [
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
    ] as IBlockData[]

    const lines: ILineData[] = [
      {
        "id": "0196cdec-81d1-75cc-9a33-64579be85235",
        "sourceId": "112345",
        "entryX": 0,
        "entryY": 0.30701754385964936,
        "exitX": 0.8547717842323652,
        "exitY": 1,
        "graphType": "StraightLineShape",
        "targetId": "1234"
      }
    ]

    graphRef.current?.compositeUpdateBlocksAndLines({ blocks, lines })

  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ height: 80 }}>
        <button onClick={() => {
          graphRef.current?.graph.current.interactions.connection.ready('StraightLineShape')
        }}>连线</button>
        <DrawTool />
      </div>
      <div style={{ height: 'calc(100% - 80px)' }} >
        <ReactPixiChart
          diagramId='diagramId'
          ref={graphRef}
          onDragToGraph={(data, position, parentId) => {
            graphRef.current?.compositeUpdateBlocksAndLines({ blocks: [createBlockData(data, position, parentId)], lines: [] })
          }}
          onConnectEnd={data => {
            graphRef.current?.compositeUpdateBlocksAndLines({ blocks: [], lines: [createLineData(data)] })
          }}
        />
      </div>
    </div>
  )
}

export default App
