import React from 'react'

function AppSimple() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          EasyClase - Test Simple
        </h1>
        <p className="text-gray-600 text-lg">
          Si ves esto, React está funcionando correctamente
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AppSimple
