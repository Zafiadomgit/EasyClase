@echo off
echo ============================================
echo     🎓 INICIANDO EASYCLASE SISTEMA COMPLETO
echo ============================================
echo.

echo 📱 Paso 1: Iniciando Frontend (React)...
start cmd /k "cd /d %~dp0 && npm run dev"

echo ⏳ Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo 🔧 Paso 2: Iniciando Backend (Express + MongoDB)...
start cmd /k "cd /d %~dp0Server.js && npm run dev"

echo.
echo ✅ ¡Sistema iniciado!
echo.
echo 🌐 URLs disponibles:
echo   Frontend: http://localhost:3001 (o el puerto que se asigne)
echo   Backend:  http://localhost:3000
echo   API:      http://localhost:3000/api/status
echo.
echo 📋 Para detener el sistema:
echo   - Cierra ambas ventanas de comando
echo   - O presiona Ctrl+C en cada una
echo.
pause
