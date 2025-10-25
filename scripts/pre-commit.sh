
#!/bin/bash
# Git hook pre-commit: Se ejecuta antes de cada commit
# Asegura que yarn.lock esté correcto en el commit

set -e

echo "🔍 Verificando yarn.lock antes del commit..."

# Cambiar al directorio raíz del proyecto
cd "$(git rev-parse --show-toplevel)"

# Si yarn.lock está en el staging area, verificar que sea un archivo real
if git diff --cached --name-only | grep -q "app/yarn.lock"; then
    if [ -L "app/yarn.lock" ]; then
        echo "❌ Error: Intentando commitear un symlink de yarn.lock"
        echo "   Ejecuta: ./scripts/sync-yarn-lock.sh to-app"
        exit 1
    fi
    
    # Actualizar master backup
    ./scripts/sync-yarn-lock.sh to-master
    
    # Si el master backup cambió, agregarlo al commit
    if [ -f ".yarn-backup/yarn.lock.master" ]; then
        git add .yarn-backup/yarn.lock.master 2>/dev/null || true
    fi
    
    echo "✅ yarn.lock verificado y backup actualizado"
fi

echo "✅ Pre-commit check completado"
