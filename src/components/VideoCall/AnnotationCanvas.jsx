import React, { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Trash2, 
  Undo, 
  Redo,
  Palette,
  Settings,
  X,
  Crown
} from 'lucide-react'

const AnnotationCanvas = ({ className, onClose }) => {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#ff0000')
  const [brushSize, setBrushSize] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState([])
  const [historyStep, setHistoryStep] = useState(0)

  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
    '#ff00ff', '#00ffff', '#ffffff', '#000000',
    '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
  ]

  const tools = [
    { id: 'pen', icon: <Pencil className="w-4 h-4" />, name: 'Lápiz' },
    { id: 'line', icon: <div className="w-4 h-0.5 bg-current"></div>, name: 'Línea' },
    { id: 'rectangle', icon: <Square className="w-4 h-4" />, name: 'Rectángulo' },
    { id: 'circle', icon: <Circle className="w-4 h-4" />, name: 'Círculo' },
    { id: 'text', icon: <Type className="w-4 h-4" />, name: 'Texto' },
    { id: 'eraser', icon: <Eraser className="w-4 h-4" />, name: 'Borrador' }
  ]

  useEffect(() => {
    if (canvasRef.current) {
      // Inicializar Fabric.js canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 'transparent',
        selection: false
      })

      fabricCanvasRef.current = canvas

      // Configurar canvas según la herramienta
      setupTool(canvas, tool)

      // Manejar cambios de tamaño de ventana
      const handleResize = () => {
        canvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      window.addEventListener('resize', handleResize)

      // Guardar estado inicial
      saveState(canvas)

      return () => {
        window.removeEventListener('resize', handleResize)
        canvas.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (fabricCanvasRef.current) {
      setupTool(fabricCanvasRef.current, tool)
    }
  }, [tool, color, brushSize])

  const setupTool = (canvas, selectedTool) => {
    // Limpiar eventos anteriores
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
    canvas.off('path:created')

    canvas.isDrawingMode = false
    canvas.selection = false

    switch (selectedTool) {
      case 'pen':
        canvas.isDrawingMode = true
        canvas.freeDrawingBrush.color = color
        canvas.freeDrawingBrush.width = brushSize
        canvas.on('path:created', () => saveState(canvas))
        break

      case 'eraser':
        canvas.isDrawingMode = true
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas)
        canvas.freeDrawingBrush.width = brushSize * 3
        canvas.on('path:created', () => saveState(canvas))
        break

      case 'line':
        setupShapeTool(canvas, 'line')
        break

      case 'rectangle':
        setupShapeTool(canvas, 'rectangle')
        break

      case 'circle':
        setupShapeTool(canvas, 'circle')
        break

      case 'text':
        setupTextTool(canvas)
        break

      default:
        break
    }
  }

  const setupShapeTool = (canvas, shape) => {
    let isDown = false
    let origX, origY

    canvas.on('mouse:down', (o) => {
      isDown = true
      const pointer = canvas.getPointer(o.e)
      origX = pointer.x
      origY = pointer.y
    })

    canvas.on('mouse:move', (o) => {
      if (!isDown) return
      
      const pointer = canvas.getPointer(o.e)
      
      // Remover shape temporal si existe
      const objects = canvas.getObjects()
      if (objects.length > 0 && objects[objects.length - 1].temp) {
        canvas.remove(objects[objects.length - 1])
      }

      let shapeObj
      switch (shape) {
        case 'line':
          shapeObj = new fabric.Line([origX, origY, pointer.x, pointer.y], {
            stroke: color,
            strokeWidth: brushSize,
            temp: true
          })
          break
        
        case 'rectangle':
          shapeObj = new fabric.Rect({
            left: Math.min(origX, pointer.x),
            top: Math.min(origY, pointer.y),
            width: Math.abs(pointer.x - origX),
            height: Math.abs(pointer.y - origY),
            fill: 'transparent',
            stroke: color,
            strokeWidth: brushSize,
            temp: true
          })
          break
        
        case 'circle':
          const radius = Math.sqrt(Math.pow(pointer.x - origX, 2) + Math.pow(pointer.y - origY, 2)) / 2
          shapeObj = new fabric.Circle({
            left: origX - radius,
            top: origY - radius,
            radius: radius,
            fill: 'transparent',
            stroke: color,
            strokeWidth: brushSize,
            temp: true
          })
          break
      }

      if (shapeObj) {
        canvas.add(shapeObj)
        canvas.renderAll()
      }
    })

    canvas.on('mouse:up', () => {
      isDown = false
      // Hacer permanente el último objeto
      const objects = canvas.getObjects()
      if (objects.length > 0 && objects[objects.length - 1].temp) {
        objects[objects.length - 1].temp = false
        saveState(canvas)
      }
    })
  }

  const setupTextTool = (canvas) => {
    canvas.on('mouse:down', (o) => {
      const pointer = canvas.getPointer(o.e)
      const text = new fabric.IText('Haz clic para editar', {
        left: pointer.x,
        top: pointer.y,
        fontFamily: 'Arial',
        fontSize: 20,
        fill: color
      })
      
      canvas.add(text)
      canvas.setActiveObject(text)
      text.enterEditing()
      saveState(canvas)
    })
  }

  const saveState = (canvas) => {
    const state = JSON.stringify(canvas.toJSON())
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1)
      newHistory.push(state)
      return newHistory
    })
    setHistoryStep(prev => prev + 1)
  }

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1)
      const previousState = history[historyStep - 1]
      fabricCanvasRef.current.loadFromJSON(previousState, () => {
        fabricCanvasRef.current.renderAll()
      })
    }
  }

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prev => prev + 1)
      const nextState = history[historyStep + 1]
      fabricCanvasRef.current.loadFromJSON(nextState, () => {
        fabricCanvasRef.current.renderAll()
      })
    }
  }

  const clearCanvas = () => {
    fabricCanvasRef.current.clear()
    saveState(fabricCanvasRef.current)
  }

  return (
    <div className={`${className} pointer-events-auto`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-auto"
        style={{ zIndex: 10 }}
      />

      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4 pointer-events-auto" style={{ zIndex: 20 }}>
        {/* Header Premium */}
        <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
          <Crown className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-semibold text-amber-600">PREMIUM</span>
        </div>

        {/* Herramientas */}
        <div className="flex items-center space-x-2">
          {tools.map((toolItem) => (
            <button
              key={toolItem.id}
              onClick={() => setTool(toolItem.id)}
              className={`p-2 rounded-lg ${
                tool === toolItem.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={toolItem.name}
            >
              {toolItem.icon}
            </button>
          ))}
        </div>

        {/* Separador */}
        <div className="border-r border-gray-200 h-8"></div>

        {/* Colores */}
        <div className="flex items-center space-x-1">
          {colors.map((colorOption) => (
            <button
              key={colorOption}
              onClick={() => setColor(colorOption)}
              className={`w-6 h-6 rounded-full border-2 ${
                color === colorOption ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: colorOption }}
              title={`Color ${colorOption}`}
            />
          ))}
        </div>

        {/* Separador */}
        <div className="border-r border-gray-200 h-8"></div>

        {/* Tamaño de pincel */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Tamaño:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 w-8">{brushSize}px</span>
        </div>

        {/* Separador */}
        <div className="border-r border-gray-200 h-8"></div>

        {/* Acciones */}
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={historyStep <= 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            title="Deshacer"
          >
            <Undo className="w-4 h-4" />
          </button>
          
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            title="Rehacer"
          >
            <Redo className="w-4 h-4" />
          </button>
          
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
            title="Limpiar todo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          title="Cerrar anotaciones"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Indicador de herramienta activa */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg pointer-events-none" style={{ zIndex: 20 }}>
        <div className="flex items-center space-x-2">
          {tools.find(t => t.id === tool)?.icon}
          <span className="text-sm">{tools.find(t => t.id === tool)?.name}</span>
          <span className="text-xs opacity-75">• {color} • {brushSize}px</span>
        </div>
      </div>
    </div>
  )
}

export default AnnotationCanvas
