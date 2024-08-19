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
    const ride = await prisma.ride.create({
      data: {
        cardNumber,
        entryStation: station,
      },
      include: {
        card: true,
      },
    });
    return ride.card.balance;
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

    const { path, totalFare } = await this.trainLineService.getOptimalRoute(ride.entryStation, station);

    await prisma.ride.update({
      where: { id: ride.id },
      data: {
        exitStation: station,
        fare: totalFare,
      },
    });

    return this.cardService.deductFare(cardNumber, totalFare);
  }
}