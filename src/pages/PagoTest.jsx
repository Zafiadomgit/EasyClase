import React from 'react'

const PagoTest = () => {
  console.log('🚀 PagoTest.jsx - Componente iniciado')
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          🎉 PÁGINA DE PAGO FUNCIONANDO
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Si ves este mensaje, el componente se está cargando correctamente.
        </p>
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          border: '1px solid #4caf50', 
          borderRadius: '5px', 
          padding: '15px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#2e7d32', margin: 0 }}>
            <strong>✅ Estado:</strong> Componente PagoTest funcionando
          </p>
        </div>
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107', 
          borderRadius: '5px', 
          padding: '15px',
          marginTop: '15px'
        }}>
          <p style={{ color: '#856404', margin: 0 }}>
            <strong>📝 Próximo paso:</strong> Reemplazar con componente completo
          </p>
        </div>
      </div>
    </div>
  )
}

export default PagoTest
