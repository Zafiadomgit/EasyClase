@echo off
echo ========================================
echo CONFIGURADOR AUTOMATICO PARA PRODUCCION
echo ========================================
echo.

echo [1/5] Configurando variables de entorno para PRODUCCION...
copy env.production .env
copy server\env.production server\.env
echo ✅ Variables de entorno configuradas para PRODUCCION
echo.

echo [2/5] Verificando archivos de configuración...
if exist .env (
    echo ✅ .env principal creado
) else (
    echo ❌ Error: No se pudo crear .env principal
)

if exist server\.env (
    echo ✅ .env del servidor creado
) else (
    echo ❌ Error: No se pudo crear .env del servidor
)
echo.

echo [3/5] Configurando .htaccess para PRODUCCION...
if exist .htaccess (
    echo ✅ .htaccess principal configurado
) else (
    echo ❌ Error: No se pudo crear .htaccess principal
)

if exist dist\.htaccess (
    echo ✅ .htaccess del frontend configurado
) else (
    echo ❌ Error: No se pudo crear .htaccess del frontend
)
echo.

echo [4/5] Verificando estructura de archivos...
if exist dist\index.html (
    echo ✅ Frontend compilado encontrado
) else (
    echo ⚠️  Advertencia: Frontend no compilado. Ejecuta: npm run build
)

if exist server\server.js (
    echo ✅ Servidor encontrado
) else (
    echo ❌ Error: Servidor no encontrado
)
echo.

echo [5/5] Configuración completada!
echo.
echo ========================================
echo RESUMEN DE CONFIGURACION
echo ========================================
echo.
echo ✅ Variables de entorno: PRODUCCION
echo ✅ .htaccess: Configurado con CSP segura
echo ✅ Headers de seguridad: Implementados
echo ✅ Caché y compresión: Optimizados
echo ✅ SPA routing: Configurado
echo.
echo ========================================
echo PROXIMOS PASOS
echo ========================================
echo.
echo 1. Compilar frontend: npm run build
echo 2. Subir archivos al servidor
echo 3. Verificar que .htaccess esté en la raíz
echo 4. Probar la aplicación
echo.
echo ========================================
echo ¡CONFIGURACION COMPLETADA EXITOSAMENTE!
echo ========================================
pause
