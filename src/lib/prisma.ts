import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Load environment variables
config({ path: '.env.local' });
config();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Prisma 7: Requires adapter for PostgreSQL
const pool =
  globalForPrisma.pool ??
  (process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : undefined);

const adapter = pool ? new PrismaPg(pool) : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  if (pool) globalForPrisma.pool = pool;
}
