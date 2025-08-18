import React, { useEffect, useRef, useState } from 'react'
import { 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Trash2, 
  Undo, 
  Redo,
  X,
  Crown
} from 'lucide-react'

const AnnotationCanvas = ({ className, onClose }) => {
  const canvasRef = useRef(null)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#ff0000')
  const [brushSize, setBrushSize] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
    '#ff00ff', '#00ffff', '#ffffff', '#000000',
    '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
  ]

  const tools = [
    { id: 'pen', icon: <Pencil className="w-4 h-4" />, name: 'Lápiz' },
    { id: 'eraser', icon: <Eraser className="w-4 h-4" />, name: 'Borrador' }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      
      // Configurar canvas
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Manejar redimensionamiento
      const handleResize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  const startDrawing = (e) => {
    setIsDrawing(true)
    const rect = canvasRef.current.getBoundingClientRect()
    setLastPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const draw = (e) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(currentPos.x, currentPos.y)
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize * 3
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
    }
    
    ctx.stroke()
    setLastPos(currentPos)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className={`${className} pointer-events-auto`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-auto cursor-crosshair"
        style={{ zIndex: 10 }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {/* Toolbar Simplificado */}
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

      {/* Aviso de versión simplificada */}
      <div className="absolute bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-xs pointer-events-none" style={{ zIndex: 20 }}>
        Versión simplificada - Mejoras próximamente
      </div>
    </div>
  )
}

export default AnnotationCanvas