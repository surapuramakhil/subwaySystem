import { prisma } from "../db/prismaClient";


export class CardService {

  async createOrUpdateCard(number: string, amount: number) {
    return prisma.card.upsert({
      where: { number },
      update: { balance: { increment: amount } },
      create: { number, balance: amount },
    });
  }

  async deductFare(number: string, fare: number) {
    return prisma.card.update({
      where: { number },
      data: { balance: { decrement: fare } },
    });
  }
  
}