import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function AppUltraSimple() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            EasyClase - Test Ultra Simple
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Si ves esto, React está funcionando sin componentes problemáticos
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-500">
                Timestamp: {new Date().toLocaleString()}
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-500">
                Sin contextos, sin componentes complejos
              </p>
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default AppUltraSimple
