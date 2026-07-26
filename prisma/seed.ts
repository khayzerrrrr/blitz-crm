import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BLITZ CRM database...');

  // Create roles
  const roles = await Promise.all([
    prisma.role.upsert({ where: { name: 'SUPER_ADMIN' }, update: {}, create: { name: 'SUPER_ADMIN' } }),
    prisma.role.upsert({ where: { name: 'OWNER' }, update: {}, create: { name: 'OWNER' } }),
    prisma.role.upsert({ where: { name: 'MANAGEMENT' }, update: {}, create: { name: 'MANAGEMENT' } }),
    prisma.role.upsert({ where: { name: 'REGIONAL' }, update: {}, create: { name: 'REGIONAL' } }),
    prisma.role.upsert({ where: { name: 'SALES' }, update: {}, create: { name: 'SALES' } }),
  ]);
  console.log(`✓ ${roles.length} roles created`);

  // Create islands
  const islands = await Promise.all([
    prisma.island.upsert({ where: { name: 'SUMATRA' }, update: {}, create: { name: 'SUMATRA' } }),
    prisma.island.upsert({ where: { name: 'JAVA' }, update: {}, create: { name: 'JAVA' } }),
    prisma.island.upsert({ where: { name: 'BALI' }, update: {}, create: { name: 'BALI' } }),
  ]);
  console.log(`✓ ${islands.length} islands created`);

  // Create default Super Admin
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@blitzcrm.id';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      passwordHash,
      roleId: roles[0].id,
    },
  });
  console.log(`✓ Super Admin created (${adminEmail} / ${adminPassword})`);

  // Create demo users
  const demoUsers = [
    { name: 'Owner Blitz', email: 'owner@blitzcrm.id', role: roles[1], island: null },
    { name: 'Manager Nasional', email: 'manager@blitzcrm.id', role: roles[2], island: null },
    { name: 'Regional Sumatra', email: 'regional-sumatra@blitzcrm.id', role: roles[3], island: islands[0] },
    { name: 'Regional Jawa', email: 'regional-jawa@blitzcrm.id', role: roles[3], island: islands[1] },
    { name: 'Sales Sumatra 1', email: 'sales-sumatera@blitzcrm.id', role: roles[4], island: islands[0] },
    { name: 'Sales Jawa 1', email: 'sales-jawa@blitzcrm.id', role: roles[4], island: islands[1] },
    { name: 'Sales Bali 1', email: 'sales-bali@blitzcrm.id', role: roles[4], island: islands[2] },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
        roleId: u.role.id,
        islandId: u.island?.id || null,
      },
    });
  }
  console.log(`✓ ${demoUsers.length} demo users created`);

  console.log('\nSeed complete! Login credentials:');
  console.log('  Super Admin: admin@blitzcrm.id / ChangeMe123!');
  console.log('  Demo users:  {name}@blitzcrm.id / ChangeMe123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
