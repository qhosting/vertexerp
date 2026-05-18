
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

# Sincronizar base de datos
echo "📦 Sincronizando base de datos..."
npx prisma@6.7.0 db push --accept-data-loss || {
  echo "⚠️  db push falló, intentando migrate deploy..."
  npx prisma@6.7.0 migrate deploy || {
    echo "❌ ERROR: No se pudo sincronizar la base de datos"
    exit 1
  }
}

echo "✅ Base de datos sincronizada"

# Generar Prisma Client (por si acaso)
echo "🔧 Generando Prisma Client..."
npx prisma@6.7.0 generate

echo "✅ Prisma Client generado"

# Crear script temporal para crear usuario root
echo "👤 Creando o actualizando usuario administrador root..."
cat << 'EOF' > /app/app/create-root-user.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = 'root@aurumcapital.mx';
  const hashedPassword = '$2a$12$G.Aic616iqXHxwn2unWxu.BGjB/OFKPxNqmg.9TnuILyoAUS4uKNq';

  console.log(`Creating or updating user ${email}...`);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      isActive: true,
      role: 'SUPERADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      firstName: 'Root',
      lastName: 'Aurum',
      name: 'Root Aurum',
      role: 'SUPERADMIN',
      isActive: true,
    },
  });

  console.log('✅ User successfully created/updated:');
  console.log(user.email);
}

main()
  .catch((e) => {
    console.error('❌ Error creating user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

node /app/app/create-root-user.js || echo "⚠️ Advertencia: Ocurrió un error no fatal al inicializar el usuario administrador"

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
