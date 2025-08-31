@echo off
echo ========================================
echo VERIFICADOR DE CONFIGURACION PRODUCCION
echo EasyClase - Sistema de Verificacion
echo ========================================
echo.

echo [1/6] Verificando archivos de configuracion...
if exist ".env" (
    echo    ✓ .env principal encontrado
) else (
    echo    ❌ .env principal NO encontrado
)

if exist "server\.env" (
    echo    ✓ .env del servidor encontrado
) else (
    echo    ❌ .env del servidor NO encontrado
)

echo.
echo [2/6] Verificando archivos de seguridad...
if exist ".htaccess" (
    echo    ✓ .htaccess principal encontrado
) else (
    echo    ❌ .htaccess principal NO encontrado
)

if exist "dist\.htaccess" (
    echo    ✓ .htaccess del frontend encontrado
) else (
    echo    ❌ .htaccess del frontend NO encontrado
)

echo.
echo [3/6] Verificando frontend compilado...
if exist "dist\index.html" (
    echo    ✓ Frontend compilado encontrado
) else (
    echo    ❌ Frontend NO compilado
)

if exist "dist\assets" (
    echo    ✓ Carpeta de assets encontrada
) else (
    echo    ❌ Carpeta de assets NO encontrada
)

echo.
echo [4/6] Verificando servidor...
echo    Verificando que el servidor este corriendo...
timeout /t 2 /nobreak >nul
curl -s http://localhost:3000/api/status >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Servidor respondiendo correctamente
) else (
    echo    ❌ Servidor NO responde
)

echo.
echo [5/6] Verificando variables de entorno...
echo    Verificando NODE_ENV...
findstr "NODE_ENV=production" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ NODE_ENV configurado para produccion
) else (
    echo    ❌ NODE_ENV NO configurado para produccion
)

echo.
echo [6/6] Resumen de verificacion...
echo ========================================
echo.
echo ARCHIVOS DE CONFIGURACION:
if exist ".env" echo ✓ .env principal
if exist "server\.env" echo ✓ .env del servidor
if exist ".htaccess" echo ✓ .htaccess principal
if exist "dist\.htaccess" echo ✓ .htaccess frontend
if exist "dist\index.html" echo ✓ Frontend compilado
echo.
echo ESTADO DEL SERVIDOR:
curl -s http://localhost:3000/api/status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Servidor funcionando
) else (
    echo ❌ Servidor NO funciona
)
echo.
echo ========================================
echo VERIFICACION COMPLETADA
echo ========================================
echo.
echo PROXIMOS PASOS:
echo 1. Subir archivos al servidor web
echo 2. Verificar que .htaccess este en la raiz
echo 3. Probar la aplicacion en produccion
echo 4. Verificar que HTTPS funcione correctamente
echo.
pause
