import React from 'react'
import { useLocation } from 'react-router-dom'

const PagoDirecto = () => {
  const location = useLocation()
  
  console.log('🚀 PagoDirecto.jsx - COMPONENTE INICIADO')
  console.log('📍 Ruta actual:', location.pathname)
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>PÁGINA DE PAGO FUNCIONANDO - PAGODIRECTO</h1>
      <p style={{ color: 'blue', fontSize: '16px' }}>Si ves esto, el componente se está cargando correctamente.</p>
      <div style={{ backgroundColor: 'yellow', padding: '10px', margin: '10px 0' }}>
        <strong>ESTADO: COMPONENTE PagoDirecto FUNCIONANDO</strong>
      </div>
      <div style={{ backgroundColor: 'lightgreen', padding: '10px', margin: '10px 0' }}>
        <strong>RUTA ACTUAL: {location.pathname}</strong>
      </div>
    </div>
  )
}

export default PagoDirecto
