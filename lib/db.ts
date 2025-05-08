import { PrismaClient } from '@prisma/client';

// Define the global interface
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with explicit error handling
export const db = globalForPrisma.prisma
  ?? new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    errorFormat: 'pretty',
  });

// Keep a single instance in development, but not in production
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// For debugging purposes (in development only)
if (process.env.NODE_ENV === 'development') {
  // Use middleware instead of $on for query logging
  db.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
    return result;
  });
}

// Export the client
export default db;
