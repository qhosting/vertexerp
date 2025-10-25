
#!/bin/bash
# Script post-install: Se ejecuta después de yarn install
# Actualiza el master backup con los cambios

set -e

echo "🔧 Ejecutando acciones post-install..."

# Cambiar al directorio raíz del proyecto
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Verificar que yarn.lock sea un archivo real
if [ -L "app/yarn.lock" ]; then
    echo "⚠️  yarn.lock es un symlink después de install, restaurando desde backup..."
    ./scripts/sync-yarn-lock.sh to-app
fi

# Actualizar master backup
echo ""
echo "📤 Actualizando master backup..."
./scripts/sync-yarn-lock.sh to-master

echo ""
echo "✅ Post-install completado"
