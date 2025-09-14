@echo off
echo ========================================
echo DESPLEGANDO EASYCLASE CON CREDENCIALES DE PRODUCCION
echo ========================================
echo.

echo [1/4] Configurando variables de entorno para PRODUCCION...
copy env.production .env
copy server\env.production server\.env
echo ✅ Variables de entorno actualizadas con credenciales de PRODUCCION
echo.

echo [2/4] Compilando frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error compilando frontend
    pause
    exit /b 1
)
echo ✅ Frontend compilado exitosamente
echo.

echo [3/4] Verificando configuración del servidor...
cd server
call npm run diagnostico
if %errorlevel% neq 0 (
    echo ❌ Error en la configuración del servidor
    pause
    exit /b 1
)
cd ..
echo ✅ Servidor configurado correctamente
echo.

echo [4/4] Preparando archivos para despliegue...
echo ✅ Archivos listos para subir al servidor
echo.

echo ========================================
echo RESUMEN DEL DESPLIEGUE
echo ========================================
echo.
echo ✅ Credenciales de MercadoPago: PRODUCCION
echo ✅ Frontend: Compilado
echo ✅ Backend: Configurado
echo ✅ Variables de entorno: Actualizadas
echo.
echo ========================================
echo PROXIMOS PASOS
echo ========================================
echo.
echo 1. Subir todos los archivos al servidor
echo 2. Asegurarse de que .htaccess esté en la raíz
echo 3. Verificar que server/.env esté en el servidor
echo 4. Probar el proceso de pago
echo.
echo ⚠️  IMPORTANTE: Ahora estás usando credenciales de PRODUCCION
echo    Los pagos serán REALES, no de prueba
echo.
echo ========================================
echo ¡DESPLIEGUE COMPLETADO!
echo ========================================
pause
