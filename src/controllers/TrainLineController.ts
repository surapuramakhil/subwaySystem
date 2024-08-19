import { Request, Response } from 'express';
import { TrainLineService } from '../services/TrainLineService';

export class TrainLineController {
  private trainLineService = new TrainLineService();

  async addTrainLine(req: Request, res: Response) {
    const { name, stations, fare } = req.body;
    await this.trainLineService.addTrainLine(name, stations, fare);
    res.status(201).json({ message: 'Train line created successfully' });
  }

  async getOptimalRoute(req: Request, res: Response) {
      const { origin, destination } = req.query as { origin: string; destination: string };
      const route = await this.trainLineService.getOptimalRoute(origin, destination);
      res.json(route); 
  }
}