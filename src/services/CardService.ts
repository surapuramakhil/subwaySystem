import { prisma } from "../db/prismaClient";
import { AppError } from "../utils/AppError";


export class CardService {

  async createOrUpdateCard(number: string, amount: number) {
    return prisma.card.upsert({
      where: { number },
      update: { balance: { increment: amount } },
      create: { number, balance: amount },
    });
  }

  async deductFare(number: string, fare: number) {

    const card = await prisma.card.findUnique({ where: { number } });

    if (!card) {
      throw new AppError('Card not found',404);
    } else if (card.balance < fare) {
      throw new AppError('Insufficient balance',400);
    }

    return prisma.card.update({
      where: { number },
      data: { balance: { decrement: fare } },
    });
  }
  
}