# 🔧 Solución Error mysql2 en Vercel

## ❌ **Error Encontrado:**
```
Error: Please install mysql2 package manually
```

## 🔍 **Causa del Problema:**
Vercel no está instalando correctamente el paquete `mysql2` que es necesario para que Sequelize se conecte a MySQL.

## 🚀 **Soluciones:**

### **Solución 1: Forzar Reinstalación (Recomendado)**

1. **Eliminar node_modules y package-lock.json:**
   ```bash
   cd server
   rm -rf node_modules package-lock.json
   ```

2. **Reinstalar dependencias:**
   ```bash
   npm install
   ```

3. **Verificar mysql2 específicamente:**
   ```bash
   npm list mysql2
   ```

4. **Hacer commit y push:**
   ```bash
   git add .
   git commit -m "Reinstalación de dependencias mysql2"
   git push origin main
   ```

### **Solución 2: Verificar Dependencias**

Ejecuta el script de verificación:
```bash
cd server
npm run check-deps
```

### **Solución 3: Instalación Manual de mysql2**

```bash
cd server
npm install mysql2@latest --save
npm install sequelize@latest --save
```

## 📋 **Verificación Post-Solución:**

### **1. Verificar Instalación Local:**
```bash
cd server
npm list mysql2
npm list sequelize
```

### **2. Probar Conexión Local:**
```bash
npm run test-real-connection
```

### **3. Verificar Configuración:**
```bash
npm run verify-mysql
```

## 🔧 **Configuración de Vercel:**

### **Variables de Entorno Confirmadas:**
```bash
MYSQL_HOST=mysql.easyclaseapp.com
MYSQL_USER=zafiadombd
MYSQL_PASSWORD=f9ZrKNH2bNuYT8d
MYSQL_DATABASE=easyclasebd_v2
MYSQL_PORT=3306
JWT_SECRET=tu_jwt_secret_super_seguro
MERCADOPAGO_ACCESS_TOKEN=tu_token_de_mercadopago
MERCADOPAGO_PUBLIC_KEY=tu_public_key_de_mercadopago
```

### **Archivos de Configuración:**
- ✅ `vercel.json` - Configuración principal
- ✅ `server/vercel.json` - Configuración específica del servidor
- ✅ `server/vercel-mysql-config.js` - Configuración MySQL

## 🚨 **Pasos de Emergencia:**

Si el problema persiste:

1. **Verificar en Vercel:**
   - Ir a Settings > General
   - Verificar que "Install Command" sea `npm install`
   - Verificar que "Build Command" sea correcto

2. **Forzar Rebuild:**
   - En Vercel, ir a Deployments
   - Hacer "Redeploy" del último deployment

3. **Verificar Logs:**
   - Revisar logs de build en Vercel
   - Buscar errores de instalación de dependencias

## 📊 **Estado Esperado Post-Solución:**

Una vez resuelto:
- ✅ `mysql2` instalado correctamente
- ✅ Sequelize funcionando
- ✅ Conexión a MySQL exitosa
- ✅ Aplicación funcionando en Vercel

## 🔗 **Enlaces Útiles:**

- **Dashboard Vercel:** https://vercel.com/dashboard
- **Documentación mysql2:** https://github.com/sidorares/node-mysql2
- **Documentación Sequelize:** https://sequelize.org/

---

## 🎯 **Resumen de la Solución:**

**El problema es que Vercel no está instalando `mysql2` correctamente. La solución es forzar la reinstalación de dependencias y verificar que el paquete esté presente antes del deploy.**

**Pasos:**
1. Reinstalar dependencias localmente
2. Verificar que mysql2 esté instalado
3. Hacer commit y push
4. Verificar en Vercel que funcione
