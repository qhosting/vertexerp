
#!/bin/bash

##############################################################################
# Script de Verificación Pre-Push
# VertexERP v4.0.0
#
# Este script verifica que todos los archivos críticos estén correctamente
# configurados antes de hacer push a GitHub, especialmente yarn.lock
##############################################################################

set -e

echo "🔍 Verificando archivos críticos antes de push..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

##############################################################################
# 1. Verificar que yarn.lock exista
##############################################################################
echo "1️⃣  Verificando existencia de app/yarn.lock..."

if [ ! -f "app/yarn.lock" ]; then
    echo -e "${RED}❌ ERROR: app/yarn.lock no existe${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ app/yarn.lock existe${NC}"
fi

##############################################################################
# 2. Verificar que yarn.lock NO sea un symlink
##############################################################################
echo ""
echo "2️⃣  Verificando que yarn.lock NO sea un symlink..."

if [ -L "app/yarn.lock" ]; then
    echo -e "${RED}❌ ERROR: app/yarn.lock es un SYMLINK${NC}"
    echo -e "${YELLOW}   Symlink apunta a: $(readlink app/yarn.lock)${NC}"
    echo ""
    echo "   🔧 Corrigiendo automáticamente..."
    
    # Obtener la ruta del symlink
    SYMLINK_TARGET=$(readlink app/yarn.lock)
    
    # Si el target existe, copiar el archivo
    if [ -f "$SYMLINK_TARGET" ]; then
        rm app/yarn.lock
        cp "$SYMLINK_TARGET" app/yarn.lock
        echo -e "${GREEN}   ✅ Convertido a archivo real${NC}"
    else
        echo -e "${RED}   ❌ No se pudo encontrar el archivo original${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${GREEN}✅ yarn.lock es un archivo regular (no symlink)${NC}"
fi

##############################################################################
# 3. Verificar tipo de archivo
##############################################################################
echo ""
echo "3️⃣  Verificando tipo de archivo..."

FILE_TYPE=$(file app/yarn.lock | grep -o "ASCII text" || echo "")
if [ "$FILE_TYPE" != "ASCII text" ]; then
    echo -e "${RED}❌ ERROR: yarn.lock no es un archivo de texto ASCII${NC}"
    echo "   Tipo detectado: $(file app/yarn.lock)"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ yarn.lock es ASCII text${NC}"
fi

##############################################################################
# 4. Verificar tamaño del archivo
##############################################################################
echo ""
echo "4️⃣  Verificando tamaño del archivo..."

FILE_SIZE=$(du -k app/yarn.lock | cut -f1)
if [ "$FILE_SIZE" -lt 100 ]; then
    echo -e "${RED}❌ ERROR: yarn.lock es demasiado pequeño (${FILE_SIZE} KB)${NC}"
    echo "   Tamaño esperado: ~434 KB"
    ERRORS=$((ERRORS + 1))
elif [ "$FILE_SIZE" -lt 400 ]; then
    echo -e "${YELLOW}⚠️  WARNING: yarn.lock parece pequeño (${FILE_SIZE} KB)${NC}"
    echo "   Tamaño esperado: ~434 KB"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ yarn.lock tiene tamaño correcto (${FILE_SIZE} KB)${NC}"
fi

##############################################################################
# 5. Verificar que esté en Git (tracked)
##############################################################################
echo ""
echo "5️⃣  Verificando que yarn.lock esté tracked en Git..."

if git ls-files --error-unmatch app/yarn.lock >/dev/null 2>&1; then
    echo -e "${GREEN}✅ yarn.lock está tracked en Git${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: yarn.lock NO está tracked en Git${NC}"
    echo "   Ejecuta: git add app/yarn.lock"
    WARNINGS=$((WARNINGS + 1))
fi

##############################################################################
# 6. Verificar otros archivos críticos
##############################################################################
echo ""
echo "6️⃣  Verificando otros archivos críticos..."

CRITICAL_FILES=(
    "Dockerfile"
    "app/package.json"
    ".dockerignore"
    "start.sh"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ ERROR: $file no existe${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ $file existe${NC}"
    fi
done

##############################################################################
# 7. Verificar permisos de start.sh
##############################################################################
echo ""
echo "7️⃣  Verificando permisos de start.sh..."

if [ -x "start.sh" ]; then
    echo -e "${GREEN}✅ start.sh tiene permisos de ejecución${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: start.sh no tiene permisos de ejecución${NC}"
    echo "   Ejecutando: chmod +x start.sh"
    chmod +x start.sh
    WARNINGS=$((WARNINGS + 1))
fi

##############################################################################
# 8. Verificar que no haya cambios sin commit
##############################################################################
echo ""
echo "8️⃣  Verificando estado de Git..."

if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Hay cambios sin commit${NC}"
    echo ""
    git status --short
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ No hay cambios sin commit${NC}"
fi

##############################################################################
# Resumen
##############################################################################
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ VERIFICACIÓN FALLIDA${NC}"
    echo -e "${RED}   Errores: $ERRORS${NC}"
    echo -e "${YELLOW}   Warnings: $WARNINGS${NC}"
    echo ""
    echo "   Por favor corrige los errores antes de hacer push."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  VERIFICACIÓN COMPLETADA CON WARNINGS${NC}"
    echo -e "${YELLOW}   Warnings: $WARNINGS${NC}"
    echo ""
    echo "   Puedes continuar, pero revisa los warnings."
    exit 0
else
    echo -e "${GREEN}✅ VERIFICACIÓN EXITOSA${NC}"
    echo -e "${GREEN}   Todo está correcto - listo para push${NC}"
    echo ""
    echo "   Puedes ejecutar:"
    echo "   $ git push origin main"
    exit 0
fi
