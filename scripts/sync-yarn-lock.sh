
#!/bin/bash
# Script de sincronización de yarn.lock
# Asegura que yarn.lock sea siempre un archivo real, no un symlink

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MASTER_LOCK="$PROJECT_ROOT/.yarn-backup/yarn.lock.master"
APP_LOCK="$PROJECT_ROOT/app/yarn.lock"

echo "🔄 Sincronizando yarn.lock..."

# Función para verificar si es un symlink
is_symlink() {
    [ -L "$1" ]
}

# Función para sincronizar desde master a app
sync_to_app() {
    echo "📥 Copiando desde master backup a app/yarn.lock"
    
    # Eliminar si es symlink
    if is_symlink "$APP_LOCK"; then
        echo "⚠️  Detectado symlink, eliminando..."
        rm -f "$APP_LOCK"
    fi
    
    # Copiar desde master
    if [ -f "$MASTER_LOCK" ]; then
        cp "$MASTER_LOCK" "$APP_LOCK"
        echo "✅ yarn.lock copiado exitosamente"
    else
        echo "❌ Error: No existe el archivo master"
        exit 1
    fi
}

# Función para sincronizar desde app a master
sync_to_master() {
    echo "📤 Actualizando master backup desde app/yarn.lock"
    
    if [ -f "$APP_LOCK" ] && ! is_symlink "$APP_LOCK"; then
        cp "$APP_LOCK" "$MASTER_LOCK"
        echo "✅ Master backup actualizado"
    else
        echo "⚠️  app/yarn.lock no es válido, omitiendo actualización de master"
    fi
}

# Verificar estado actual
echo ""
echo "📊 Estado actual:"
if [ -L "$APP_LOCK" ]; then
    echo "  app/yarn.lock: 🔗 SYMLINK (necesita corrección)"
    NEEDS_FIX=true
elif [ -f "$APP_LOCK" ]; then
    echo "  app/yarn.lock: ✅ Archivo real"
    NEEDS_FIX=false
else
    echo "  app/yarn.lock: ❌ No existe"
    NEEDS_FIX=true
fi

if [ -f "$MASTER_LOCK" ]; then
    echo "  Master backup: ✅ Existe"
else
    echo "  Master backup: ❌ No existe"
fi

echo ""

# Ejecutar acción según argumento
case "${1:-check}" in
    to-app)
        sync_to_app
        ;;
    to-master)
        sync_to_master
        ;;
    both)
        if [ "$NEEDS_FIX" = true ]; then
            sync_to_app
        fi
        sync_to_master
        ;;
    check)
        if [ "$NEEDS_FIX" = true ]; then
            echo "⚠️  Se requiere sincronización. Ejecuta:"
            echo "   ./scripts/sync-yarn-lock.sh to-app"
            exit 1
        else
            echo "✅ yarn.lock está correcto"
        fi
        ;;
    *)
        echo "Uso: $0 [to-app|to-master|both|check]"
        echo ""
        echo "  to-app    : Copia master backup → app/yarn.lock"
        echo "  to-master : Copia app/yarn.lock → master backup"
        echo "  both      : Sincroniza en ambas direcciones"
        echo "  check     : Solo verifica el estado (default)"
        exit 1
        ;;
esac

echo ""
echo "✅ Sincronización completada"
