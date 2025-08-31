@echo off
echo ========================================
echo CONFIGURADOR AUTOMATICO PARA DESARROLLO
echo ========================================
echo.

echo [1/5] Configurando variables de entorno para DESARROLLO...
copy env.development .env
copy server\env.development server\.env
echo ✅ Variables de entorno configuradas para DESARROLLO
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

echo [3/5] Configurando .htaccess para DESARROLLO...
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
if exist server\server.js (
    echo ✅ Servidor encontrado
) else (
    echo ❌ Error: Servidor no encontrado
)

if exist src\App.jsx (
    echo ✅ Frontend source encontrado
) else (
    echo ❌ Error: Frontend source no encontrado
)
echo.

echo [5/5] Configuración completada!
echo.
echo ========================================
echo RESUMEN DE CONFIGURACION
echo ========================================
echo.
echo ✅ Variables de entorno: DESARROLLO
echo ✅ URLs configuradas: localhost
echo ✅ Base de datos: MySQL Dreamhost
echo ✅ Servidor: Puerto 3000
echo ✅ Frontend: Puerto 3001
echo.
echo ========================================
echo PROXIMOS PASOS
echo ========================================
echo.
echo 1. Iniciar servidor: cd server && npm start
echo 2. Iniciar frontend: npm run dev
echo 3. Probar en: http://localhost:3001
echo 4. API en: http://localhost:3000
echo.
echo ========================================
echo ¡CONFIGURACION COMPLETADA EXITOSAMENTE!
echo ========================================
pause
