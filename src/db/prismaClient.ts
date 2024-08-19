import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function withTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(operation);
  }