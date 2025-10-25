
#!/bin/bash
# Script pre-build: Se ejecuta antes de builds de Docker o yarn build
# Asegura que yarn.lock esté correcto

set -e

echo "🔧 Ejecutando verificaciones pre-build..."

# Cambiar al directorio raíz del proyecto
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Sincronizar yarn.lock
echo ""
echo "1️⃣ Verificando yarn.lock..."
./scripts/sync-yarn-lock.sh to-app

# Verificar que sea un archivo real
if [ -L "app/yarn.lock" ]; then
    echo "❌ Error: app/yarn.lock sigue siendo un symlink"
    exit 1
fi

echo ""
echo "2️⃣ Verificando package.json..."
if [ ! -f "app/package.json" ]; then
    echo "❌ Error: app/package.json no existe"
    exit 1
fi

echo ""
echo "✅ Verificaciones pre-build completadas exitosamente"
echo ""
