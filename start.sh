
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
npx prisma@6.7.0 migrate deploy || {
  echo "⚠️  Migraciones fallaron, intentando push..."
  npx prisma@6.7.0 db push --accept-data-loss || {
    echo "❌ ERROR: No se pudo sincronizar la base de datos"
    exit 1
  }
}

echo "✅ Base de datos sincronizada"

# Generar Prisma Client (por si acaso)
echo "🔧 Generando Prisma Client..."
npx prisma@6.7.0 generate

echo "✅ Prisma Client generado"

# Iniciar la aplicación
echo "🎉 Iniciando aplicación en puerto ${PORT:-3000}..."
if [ -f "server.js" ]; then
  node server.js
elif [ -f "app/server.js" ]; then
  node app/server.js
else
  echo "❌ ERROR: No se pudo encontrar server.js en el contenedor"
  exit 1
fi
