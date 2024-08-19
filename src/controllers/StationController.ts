import { RideService } from "../services/RideService";
import { Request, Response } from 'express';

class StationController {
    static enterStation(arg0: string, enterStation: any) {
        throw new Error('Method not implemented.');
    }
    static exitStation(arg0: string, exitStation: any) {
        throw new Error('Method not implemented.');
    }
    constructor(private rideService: RideService) {}
  
    async enterStation(req: Request, res: Response) {
      const { station } = req.params;
      const { card_number } = req.body;
      const balance = await this.rideService.startRide(card_number, station);
      res.json({ amount: balance });
    }
  
    async exitStation(req: Request, res: Response) {
      const { station } = req.params;
      const { card_number } = req.body;
      const balance = await this.rideService.endRide(card_number, station);
      res.json({ amount: balance });
    }
}
  