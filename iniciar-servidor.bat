@echo off
echo ========================================
echo    INICIANDO SERVIDOR EASYCLASE
echo ========================================
echo.

echo 🔍 Verificando dependencias...
cd /d "%~dp0"

echo 📦 Instalando dependencias del servidor...
cd server
call npm install
cd ..

echo 🚀 Iniciando servidor...
echo.
echo 🌍 El servidor estara disponible en:
echo    - Frontend: http://localhost:3000
echo    - API: http://localhost:3000/api
echo    - Status: http://localhost:3000/api/status
echo.
echo ⚠️  Presiona Ctrl+C para detener el servidor
echo.

node server-config.js

pause
