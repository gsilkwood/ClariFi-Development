import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Ensure test env is loaded and DATABASE_URL points to test DB
if (process.env.NODE_ENV === 'test') {
  // Load .env.test explicitly (non-fatal if missing)
  dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
  if (!process.env.DATABASE_URL || /clarifi_dev/.test(process.env.DATABASE_URL)) {
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://gsilkwood@localhost/clarifi_test';
  }
}

let prisma: PrismaClient;

export const setupTestDb = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  return prisma;
};

export const cleanupTestDb = async (): Promise<void> => {
  if (!prisma) return;

  // Delete in reverse order of foreign key dependencies
  await prisma.userSession.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.userRole.deleteMany({});
};

export const closeTestDb = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

export const seedTestUser = async (): Promise<any> => {
  if (!prisma) setupTestDb();

  const role = await prisma.userRole.upsert({
    where: { name: 'BORROWER' },
    update: {},
    create: {
      name: 'BORROWER',
      description: 'Test borrower role',
      permissions: ['view_own_loans'],
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: '$2b$10$test', // Mock hashed password
      roleId: role.id,
      status: 'active',
    },
    include: { role: true },
  });

  return user;
};

export const getTestClient = (): PrismaClient => {
  return setupTestDb();
};
