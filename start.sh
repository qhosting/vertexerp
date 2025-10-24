
#!/bin/sh

# ===========================================
# Script de Inicio para Sistema ERP
# ===========================================

echo "🚀 Iniciando Sistema ERP Completo v4.0..."

# Verificar que DATABASE_URL esté configurado
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL no está configurado"
  exit 1
fi

echo "✅ Variables de entorno verificadas"

# Ejecutar migraciones de Prisma
echo "📦 Aplicando migraciones de base de datos..."
npx prisma migrate deploy || {
  echo "⚠️  Migraciones fallaron, intentando push..."
  npx prisma db push --accept-data-loss || {
    echo "❌ ERROR: No se pudo sincronizar la base de datos"
    exit 1
  }
}

echo "✅ Base de datos sincronizada"

# Generar Prisma Client (por si acaso)
echo "🔧 Generando Prisma Client..."
npx prisma generate

echo "✅ Prisma Client generado"

# Iniciar la aplicación
echo "🎉 Iniciando aplicación en puerto ${PORT:-3000}..."
node server.js
