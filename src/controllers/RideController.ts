import { Request, Response } from 'express';
import { RideService } from '../services/RideService';

export class RideController {
  private rideService = new RideService();

  async startRide(req: Request, res: Response) {
    const { station } = req.params;
    const { card_number } = req.body;
    const balance = await this.rideService.startRide(card_number, station);
    res.json({ amount: balance });
  }

  async endRide(req: Request, res: Response) {
    const { station } = req.params;
    const { card_number } = req.body;
    const balance = await this.rideService.endRide(card_number, station);
    res.json({ amount: balance });
  }
}