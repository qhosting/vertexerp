
#!/bin/bash
# Configura los Git hooks para el proyecto

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

echo "🔧 Configurando Git hooks..."

# Crear directorio de hooks si no existe
mkdir -p "$HOOKS_DIR"

# Instalar pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash
# Git pre-commit hook - Auto-generado por setup-hooks.sh

# Ejecutar el script de pre-commit
SCRIPT_DIR="$(git rev-parse --show-toplevel)/scripts"
if [ -f "$SCRIPT_DIR/pre-commit.sh" ]; then
    bash "$SCRIPT_DIR/pre-commit.sh"
else
    echo "⚠️  Advertencia: scripts/pre-commit.sh no encontrado"
fi
EOF

chmod +x "$HOOKS_DIR/pre-commit"
echo "✅ Pre-commit hook instalado"

# Hacer todos los scripts ejecutables
chmod +x "$PROJECT_ROOT/scripts/"*.sh

echo ""
echo "✅ Git hooks configurados exitosamente"
echo ""
echo "Hooks instalados:"
echo "  - pre-commit: Verifica yarn.lock antes de commits"
echo ""
