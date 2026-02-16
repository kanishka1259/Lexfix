import { PrismaClient } from '@prisma/client';

/**
 * LexFix Prisma 7.3.0 Singleton:
 * The constructor no longer accepts 'datasources'. 
 * It automatically reads from prisma.config.ts at the root.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;