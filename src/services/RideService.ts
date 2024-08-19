import prisma from '../db/prismaClient';
import { TrainLineService } from './TrainLineService';
import { CardService } from './CardService';

export class RideService {
  private trainLineService: TrainLineService;
  private cardService: CardService;

  constructor() {
    this.trainLineService = new TrainLineService();
    this.cardService = new CardService();
  }

  async startRide(cardNumber: string, station: string) {

    const fare = await this.trainLineService.getLineFare(station);

    const updatedCard = await this.cardService.deductFare(cardNumber, fare);

    await prisma.ride.create({
      data: {
        cardNumber,
        entryStation: station,
        fare: fare,
      },
    });

    return updatedCard.balance;
  }

  async endRide(cardNumber: string, station: string) {
    const ride = await prisma.ride.findFirst({
      where: {
        cardNumber,
        exitStation: null,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!ride) {
      throw new Error('No active ride found');
    }

    await prisma.ride.update({
      where: { id: ride.id },
      data: {
        exitStation: station,
      },
    });

    const card = await prisma.card.findUnique({
      where: { number: cardNumber },
    });

    if (!card) {
      throw new Error('Card not found');
    }

    return card.balance;
  }
}