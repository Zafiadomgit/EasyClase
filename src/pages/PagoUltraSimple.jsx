import React from 'react'

const PagoUltraSimple = () => {
  console.log('🚀 PagoUltraSimple cargado')
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ color: 'green' }}>PÁGINA DE PAGO FUNCIONANDO</h1>
      <p>Componente cargado correctamente</p>
      <p>Fecha: {new Date().toLocaleString()}</p>
    </div>
  )
}

export default PagoUltraSimple