@echo off
echo ========================================
echo DESPLEGANDO SERVIDOR NODE.JS PARA MERCADOPAGO
echo ========================================
echo.

echo [1/3] Verificando configuración del servidor...
cd server
if not exist "package.json" (
    echo ❌ Error: No se encontró package.json en la carpeta server
    pause
    exit /b 1
)
echo ✅ package.json encontrado

echo.
echo [2/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas

echo.
echo [3/3] Verificando configuración de MercadoPago...
if not exist ".env" (
    echo ⚠️ No se encontró .env, copiando desde env.production...
    copy ..\env.production .env
)
echo ✅ Variables de entorno configuradas

echo.
echo ========================================
echo ARCHIVOS PARA SUBIR AL SERVIDOR
echo ========================================
echo.
echo 📁 CARPETA COMPLETA: server/
echo    - server.js
echo    - package.json
echo    - package-lock.json
echo    - .env (variables de entorno)
echo    - routes/ (todas las rutas)
echo    - services/ (servicios)
echo    - models/ (modelos)
echo.
echo 📍 UBICACIÓN EN SERVIDOR: /server/
echo.
echo 🚀 INSTRUCCIONES:
echo 1. Sube toda la carpeta 'server' a tu servidor
echo 2. Asegúrate de que Node.js esté instalado en tu hosting
echo 3. Configura el servidor para ejecutar: node server/server.js
echo 4. El endpoint será: /api/mercadopago/crear-preferencia
echo.
echo ⚠️ IMPORTANTE:
echo - Verifica que tu hosting soporte Node.js
echo - Asegúrate de que el puerto esté configurado correctamente
echo - Los archivos PHP seguirán funcionando como respaldo
echo.
echo ========================================
echo ¡CONFIGURACIÓN COMPLETADA!
echo ========================================
pause
