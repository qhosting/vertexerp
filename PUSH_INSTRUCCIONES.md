# 🚀 Instrucciones para Push a GitHub

## 📦 Estado Actual

✅ **Commit creado exitosamente:**
- Configuración completa de Docker y Easypanel
- 8 archivos nuevos añadidos
- Commit hash: `67c4473`

## 🔐 Opciones para Push

### Opción 1: Usando un nuevo Personal Access Token

1. **Generar nuevo token en GitHub:**
   - Ve a: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Permisos necesarios: `repo` (Full control)
   - Expiration: 90 días
   - Copia el token

2. **Push con el token:**
```bash
cd /home/ubuntu/sistema_erp_completo
git remote set-url origin https://NUEVO_TOKEN@github.com/qhosting/sistema-erp-completo.git
git push origin main
```

### Opción 2: Usando SSH (Recomendado)

1. **Generar clave SSH:**
```bash
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"
# Presiona Enter 3 veces (sin passphrase)
cat ~/.ssh/id_ed25519.pub
```

2. **Añadir clave a GitHub:**
   - Ve a: https://github.com/settings/keys
   - Click "New SSH key"
   - Pega la clave pública
   - Click "Add SSH key"

3. **Push con SSH:**
```bash
cd /home/ubuntu/sistema_erp_completo
git remote set-url origin git@github.com:qhosting/sistema-erp-completo.git
git push origin main
```

### Opción 3: Desde tu máquina local

Si tienes acceso local al repositorio:

```bash
# Clonar el repo
git clone https://github.com/qhosting/sistema-erp-completo.git
cd sistema-erp-completo

# Pull los cambios del servidor (si los hay)
git pull origin main

# Push tus cambios locales
git push origin main
```

## 📋 Archivos Listos para Push

```
✅ Dockerfile                    - Build optimizado multi-stage
✅ docker-compose.yml            - Orquestación de servicios
✅ start.sh                      - Script de inicialización
✅ .dockerignore                 - Optimización de build
✅ .env.production.example       - Variables de entorno
✅ EASYPANEL-COMPLETE-GUIDE.md   - Guía completa de deployment
✅ app/next.config.js            - Configuración standalone
✅ app/app/api/health/route.ts   - Health check endpoint
```

## ✅ Después del Push

Una vez que hayas hecho push exitosamente:

1. **Verificar en GitHub:**
   - Ve a: https://github.com/qhosting/sistema-erp-completo
   - Verifica que los archivos nuevos estén allí

2. **Listo para deployment:**
   - Sigue la guía: `EASYPANEL-COMPLETE-GUIDE.md`
   - O despliega directamente desde Easypanel

## 🆘 ¿Necesitas ayuda?

Si tienes problemas con el push, proporciona un nuevo token válido o configura SSH.

