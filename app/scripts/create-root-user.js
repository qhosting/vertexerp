const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'root@aurumcapital.mx';
  const password = 'x0420EZS#';
  const hashedPassword = await bcrypt.hash(password, 12);

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
  console.log(user);
}

main()
  .catch((e) => {
    console.error('❌ Error creating user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
